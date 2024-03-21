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
 *   title: Asset Criticality Status Schema
 *   version: 1.0.0
 */

export type AssetCriticalityStatusResponse = z.infer<typeof AssetCriticalityStatusResponse>;
export const AssetCriticalityStatusResponse = z.object({
  asset_criticality_resources_installed: z.boolean().optional(),
});