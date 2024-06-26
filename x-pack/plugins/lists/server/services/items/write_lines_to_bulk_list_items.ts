/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Readable } from 'stream';

import { ElasticsearchClient } from '@kbn/core/server';
import type {
  DeserializerOrUndefined,
  ListIdOrUndefined,
  ListSchema,
  MetaOrUndefined,
  RefreshWithWaitFor,
  SerializerOrUndefined,
  Type,
} from '@kbn/securitysolution-io-ts-list-types';
import { Version } from '@kbn/securitysolution-io-ts-types';
import { i18n } from '@kbn/i18n';

import { createListIfItDoesNotExist } from '../lists/create_list_if_it_does_not_exist';
import { ConfigType } from '../../config';

import { BufferLines } from './buffer_lines';
import { createListItemsBulk } from './create_list_items_bulk';

export interface ImportListItemsToStreamOptions {
  listId: ListIdOrUndefined;
  config: ConfigType;
  listIndex: string;
  deserializer: DeserializerOrUndefined;
  serializer: SerializerOrUndefined;
  stream: Readable;
  esClient: ElasticsearchClient;
  listItemIndex: string;
  type: Type;
  user: string;
  meta: MetaOrUndefined;
  version: Version;
  refresh?: RefreshWithWaitFor;
}

export const importListItemsToStream = ({
  config,
  deserializer,
  serializer,
  listId,
  stream,
  esClient,
  listItemIndex,
  listIndex,
  type,
  user,
  meta,
  version,
  refresh,
}: ImportListItemsToStreamOptions): Promise<ListSchema | null> => {
  return new Promise<ListSchema | null>((resolve, reject) => {
    const readBuffer = new BufferLines({ bufferSize: config.importBufferSize, input: stream });
    let fileName: string | undefined;
    let list: ListSchema | null = null;
    readBuffer.on('fileName', async (fileNameEmitted: string) => {
      try {
        readBuffer.pause();
        fileName = decodeURIComponent(fileNameEmitted);
        if (listId == null) {
          list = await createListIfItDoesNotExist({
            description: i18n.translate('xpack.lists.services.items.fileUploadFromFileSystem', {
              defaultMessage: 'File uploaded from file system of {fileName}',
              values: { fileName },
            }),
            deserializer,
            esClient,
            id: fileName,
            immutable: false,
            listIndex,
            meta,
            name: fileName,
            serializer,
            type,
            user,
            version,
          });
        }
        readBuffer.resume();
      } catch (err) {
        reject(err);
      }
    });

    readBuffer.on('lines', async (lines: string[]) => {
      try {
        if (listId != null) {
          await writeBufferToItems({
            buffer: lines,
            deserializer,
            esClient,
            listId,
            listItemIndex,
            meta,
            refresh,
            serializer,
            type,
            user,
          });
        } else if (fileName != null) {
          await writeBufferToItems({
            buffer: lines,
            deserializer,
            esClient,
            listId: fileName,
            listItemIndex,
            meta,
            refresh,
            serializer,
            type,
            user,
          });
        }
      } catch (err) {
        reject(err);
      }
    });

    readBuffer.on('close', () => {
      resolve(list);
    });
  });
};

export interface WriteBufferToItemsOptions {
  listId: string;
  deserializer: DeserializerOrUndefined;
  serializer: SerializerOrUndefined;
  esClient: ElasticsearchClient;
  listItemIndex: string;
  buffer: string[];
  type: Type;
  user: string;
  meta: MetaOrUndefined;
  refresh?: RefreshWithWaitFor;
}

export interface LinesResult {
  linesProcessed: number;
}

export const writeBufferToItems = async ({
  listId,
  esClient,
  deserializer,
  serializer,
  listItemIndex,
  buffer,
  type,
  user,
  meta,
  refresh,
}: WriteBufferToItemsOptions): Promise<LinesResult> => {
  await createListItemsBulk({
    deserializer,
    esClient,
    listId,
    listItemIndex,
    meta,
    refresh,
    serializer,
    type,
    user,
    value: buffer,
  });
  return { linesProcessed: buffer.length };
};
