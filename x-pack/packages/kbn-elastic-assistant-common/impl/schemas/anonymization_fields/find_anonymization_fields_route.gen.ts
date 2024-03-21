/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from 'zod';
import { ArrayFromString } from '@kbn/zod-helpers';

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Find AnonymizationFields API endpoint
 *   version: 2023-10-31
 */

import { AnonymizationFieldResponse } from './bulk_crud_anonymization_fields_route.gen';

export type FindAnonymizationFieldsSortField = z.infer<typeof FindAnonymizationFieldsSortField>;
export const FindAnonymizationFieldsSortField = z.enum([
  'created_at',
  'is_default',
  'title',
  'updated_at',
]);
export type FindAnonymizationFieldsSortFieldEnum = typeof FindAnonymizationFieldsSortField.enum;
export const FindAnonymizationFieldsSortFieldEnum = FindAnonymizationFieldsSortField.enum;

export type SortOrder = z.infer<typeof SortOrder>;
export const SortOrder = z.enum(['asc', 'desc']);
export type SortOrderEnum = typeof SortOrder.enum;
export const SortOrderEnum = SortOrder.enum;

export type FindAnonymizationFieldsRequestQuery = z.infer<
  typeof FindAnonymizationFieldsRequestQuery
>;
export const FindAnonymizationFieldsRequestQuery = z.object({
  fields: ArrayFromString(z.string()).optional(),
  /**
   * Search query
   */
  filter: z.string().optional(),
  /**
   * Field to sort by
   */
  sort_field: FindAnonymizationFieldsSortField.optional(),
  /**
   * Sort order
   */
  sort_order: SortOrder.optional(),
  /**
   * Page number
   */
  page: z.coerce.number().int().min(1).optional().default(1),
  /**
   * AnonymizationFields per page
   */
  per_page: z.coerce.number().int().min(0).optional().default(20),
});
export type FindAnonymizationFieldsRequestQueryInput = z.input<
  typeof FindAnonymizationFieldsRequestQuery
>;

export type FindAnonymizationFieldsResponse = z.infer<typeof FindAnonymizationFieldsResponse>;
export const FindAnonymizationFieldsResponse = z.object({
  page: z.number().int(),
  perPage: z.number().int(),
  total: z.number().int(),
  data: z.array(AnonymizationFieldResponse),
});