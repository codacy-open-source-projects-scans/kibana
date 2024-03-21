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
 *   title: Threshold Rule Attributes
 *   version: not applicable
 */

import { AlertSuppressionDuration } from '../common_attributes.gen';

export type ThresholdCardinality = z.infer<typeof ThresholdCardinality>;
export const ThresholdCardinality = z.array(
  z.object({
    field: z.string(),
    value: z.number().int().min(0),
  })
);

/**
 * Threshold value
 */
export type ThresholdValue = z.infer<typeof ThresholdValue>;
export const ThresholdValue = z.number().int().min(1);

/**
 * Field to aggregate on
 */
export type ThresholdField = z.infer<typeof ThresholdField>;
export const ThresholdField = z.union([z.string(), z.array(z.string())]);

/**
 * Field to aggregate on
 */
export type ThresholdFieldNormalized = z.infer<typeof ThresholdFieldNormalized>;
export const ThresholdFieldNormalized = z.array(z.string());

export type Threshold = z.infer<typeof Threshold>;
export const Threshold = z.object({
  field: ThresholdField,
  value: ThresholdValue,
  cardinality: ThresholdCardinality.optional(),
});

export type ThresholdNormalized = z.infer<typeof ThresholdNormalized>;
export const ThresholdNormalized = z.object({
  field: ThresholdFieldNormalized,
  value: ThresholdValue,
  cardinality: ThresholdCardinality.optional(),
});

export type ThresholdWithCardinality = z.infer<typeof ThresholdWithCardinality>;
export const ThresholdWithCardinality = z.object({
  field: ThresholdFieldNormalized,
  value: ThresholdValue,
  cardinality: ThresholdCardinality,
});

export type ThresholdAlertSuppression = z.infer<typeof ThresholdAlertSuppression>;
export const ThresholdAlertSuppression = z.object({
  duration: AlertSuppressionDuration,
});