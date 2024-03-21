/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from 'zod';

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Delete Saved Queries Schema
 *   version: 2023-10-31
 */

import { PackId } from '../model/schema/common_attributes.gen';

export type DeletePacksRequestQuery = z.infer<typeof DeletePacksRequestQuery>;
export const DeletePacksRequestQuery = z.object({
  id: PackId.optional(),
});

export type SuccessResponse = z.infer<typeof SuccessResponse>;
export const SuccessResponse = z.object({});