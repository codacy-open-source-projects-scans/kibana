/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { encode } from 'gpt-tokenizer';
import { first, sum } from 'lodash';
import OpenAI from 'openai';
import { filter, map, Observable, tap } from 'rxjs';
import { v4 } from 'uuid';
import { TokenCountEvent } from '../../../../common/conversation_complete';
import {
  ChatCompletionChunkEvent,
  createInternalServerError,
  createTokenLimitReachedError,
  StreamingChatResponseEventType,
} from '../../../../common';

export type CreateChatCompletionResponseChunk = Omit<OpenAI.ChatCompletionChunk, 'choices'> & {
  choices: Array<
    Omit<OpenAI.ChatCompletionChunk.Choice, 'message'> & {
      delta: { content?: string; function_call?: { name?: string; arguments?: string } };
    }
  >;
};

export function processOpenAiStream(promptTokenCount: number) {
  return (source: Observable<string>): Observable<ChatCompletionChunkEvent | TokenCountEvent> => {
    return new Observable<ChatCompletionChunkEvent | TokenCountEvent>((subscriber) => {
      const id = v4();

      let completionTokenCount = 0;

      function emitTokenCountEvent() {
        subscriber.next({
          type: StreamingChatResponseEventType.TokenCount,
          tokens: {
            completion: completionTokenCount,
            prompt: promptTokenCount,
            total: completionTokenCount + promptTokenCount,
          },
        });
      }

      const parsed$ = source.pipe(
        filter((line) => !!line && line !== '[DONE]'),
        map(
          (line) =>
            JSON.parse(line) as CreateChatCompletionResponseChunk | { error: { message: string } }
        ),
        tap((line) => {
          if ('error' in line) {
            throw createInternalServerError(line.error.message);
          }
          if (
            'choices' in line &&
            line.choices.length &&
            line.choices[0].finish_reason === 'length'
          ) {
            throw createTokenLimitReachedError();
          }

          const firstChoice = first(line.choices);

          completionTokenCount += sum(
            [
              firstChoice?.delta.content,
              firstChoice?.delta.function_call?.name,
              firstChoice?.delta.function_call?.arguments,
            ].map((val) => encode(val || '').length) || 0
          );
        }),
        filter(
          (line): line is CreateChatCompletionResponseChunk =>
            'object' in line && line.object === 'chat.completion.chunk'
        ),
        map((chunk): ChatCompletionChunkEvent => {
          return {
            id,
            type: StreamingChatResponseEventType.ChatCompletionChunk,
            message: {
              content: chunk.choices[0].delta.content || '',
              function_call: chunk.choices[0].delta.function_call,
            },
          };
        })
      );

      parsed$.subscribe({
        next: (val) => {
          subscriber.next(val);
        },
        error: (error) => {
          emitTokenCountEvent();
          subscriber.error(error);
        },
        complete: () => {
          emitTokenCountEvent();
          subscriber.complete();
        },
      });
    });
  };
}