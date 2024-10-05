/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Elastic Security - Timeline - Get Timelines API
 *   version: 2023-10-31
 */

import { z } from '@kbn/zod';

import {
  TimelineType,
  SortFieldTimeline,
  TimelineStatus,
  TimelineResponse,
} from '../model/components.gen';

export type GetTimelinesRequestQuery = z.infer<typeof GetTimelinesRequestQuery>;
export const GetTimelinesRequestQuery = z.object({
  /**
   * If true, only timelines that are marked as favorites by the user are returned.
   */
  only_user_favorite: z.enum(['true', 'false']).nullable().optional(),
  timeline_type: TimelineType.nullable().optional(),
  sort_field: SortFieldTimeline.optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page_size: z.string().nullable().optional(),
  page_index: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  status: TimelineStatus.nullable().optional(),
});
export type GetTimelinesRequestQueryInput = z.input<typeof GetTimelinesRequestQuery>;

export type GetTimelinesResponse = z.infer<typeof GetTimelinesResponse>;
export const GetTimelinesResponse = z.object({
  timeline: z.array(TimelineResponse),
  totalCount: z.number(),
  defaultTimelineCount: z.number().optional(),
  templateTimelineCount: z.number().optional(),
  favoriteCount: z.number().optional(),
  elasticTemplateTimelineCount: z.number().optional(),
  customTemplateTimelineCount: z.number().optional(),
});
