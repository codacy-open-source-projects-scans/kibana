/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as rt from 'io-ts';
import { xor } from 'lodash';

export const METRIC_EXPLORER_AGGREGATIONS = [
  'avg',
  'max',
  'min',
  'cardinality',
  'rate',
  'count',
  'sum',
  'p95',
  'p99',
  'custom',
] as const;

export const OMITTED_AGGREGATIONS_FOR_CUSTOM_METRICS = ['custom', 'rate', 'p95', 'p99'];

type MetricExplorerAggregations = (typeof METRIC_EXPLORER_AGGREGATIONS)[number];

const metricsExplorerAggregationKeys = METRIC_EXPLORER_AGGREGATIONS.reduce<
  Record<MetricExplorerAggregations, null>
>((acc, agg) => ({ ...acc, [agg]: null }), {} as Record<MetricExplorerAggregations, null>);

export const metricsExplorerAggregationRT = rt.keyof(metricsExplorerAggregationKeys);

export type MetricExplorerCustomMetricAggregations = Exclude<
  MetricsExplorerAggregation,
  'custom' | 'rate' | 'p95' | 'p99'
>;
const metricsExplorerCustomMetricAggregationKeys = xor(
  METRIC_EXPLORER_AGGREGATIONS,
  OMITTED_AGGREGATIONS_FOR_CUSTOM_METRICS
).reduce<Record<MetricExplorerCustomMetricAggregations, null>>(
  (acc, agg) => ({ ...acc, [agg]: null }),
  {} as Record<MetricExplorerCustomMetricAggregations, null>
);
export const metricsExplorerCustomMetricAggregationRT = rt.keyof(
  metricsExplorerCustomMetricAggregationKeys
);

export const metricsExplorerMetricRequiredFieldsRT = rt.type({
  aggregation: metricsExplorerAggregationRT,
});

export const metricsExplorerCustomMetricRT = rt.intersection([
  rt.type({
    name: rt.string,
    aggregation: metricsExplorerCustomMetricAggregationRT,
  }),
  rt.partial({
    field: rt.string,
    filter: rt.string,
  }),
]);

export type MetricsExplorerCustomMetric = rt.TypeOf<typeof metricsExplorerCustomMetricRT>;

export const metricsExplorerMetricOptionalFieldsRT = rt.partial({
  field: rt.union([rt.string, rt.undefined]),
  custom_metrics: rt.array(metricsExplorerCustomMetricRT),
  equation: rt.string,
});

export const metricsExplorerMetricRT = rt.intersection([
  metricsExplorerMetricRequiredFieldsRT,
  metricsExplorerMetricOptionalFieldsRT,
]);

export const timeRangeRT = rt.type({
  from: rt.number,
  to: rt.number,
  interval: rt.string,
});

export const metricsExplorerRequestBodyRequiredFieldsRT = rt.type({
  timerange: timeRangeRT,
  indexPattern: rt.string,
  metrics: rt.array(metricsExplorerMetricRT),
});

const groupByRT = rt.union([rt.string, rt.null, rt.undefined]);
export const afterKeyObjectRT = rt.record(rt.string, rt.union([rt.string, rt.null]));

export const metricsExplorerRequestBodyOptionalFieldsRT = rt.partial({
  groupBy: rt.union([groupByRT, rt.array(groupByRT)]),
  groupInstance: rt.union([groupByRT, rt.array(groupByRT)]),
  afterKey: rt.union([rt.string, rt.null, rt.undefined, afterKeyObjectRT]),
  limit: rt.union([rt.number, rt.null, rt.undefined]),
  filterQuery: rt.union([rt.string, rt.null, rt.undefined]),
  forceInterval: rt.boolean,
  dropLastBucket: rt.boolean,
});

export const metricsExplorerRequestBodyRT = rt.intersection([
  metricsExplorerRequestBodyRequiredFieldsRT,
  metricsExplorerRequestBodyOptionalFieldsRT,
]);

export const metricsExplorerPageInfoRT = rt.type({
  total: rt.number,
  afterKey: rt.union([rt.string, rt.null, afterKeyObjectRT]),
});

export const metricsExplorerColumnTypeRT = rt.keyof({
  date: null,
  number: null,
  string: null,
});

export const metricsExplorerColumnRT = rt.type({
  name: rt.string,
  type: metricsExplorerColumnTypeRT,
});

export const metricsExplorerRowRT = rt.intersection([
  rt.type({
    timestamp: rt.number,
  }),
  rt.record(
    rt.string,
    rt.union([rt.string, rt.number, rt.null, rt.undefined, rt.array(rt.object)])
  ),
]);

export const metricsExplorerSeriesRT = rt.intersection([
  rt.type({
    id: rt.string,
    columns: rt.array(metricsExplorerColumnRT),
    rows: rt.array(metricsExplorerRowRT),
  }),
  rt.partial({
    keys: rt.array(rt.string),
  }),
]);

export const metricsExplorerResponseRT = rt.type({
  series: rt.array(metricsExplorerSeriesRT),
  pageInfo: metricsExplorerPageInfoRT,
});

export type AfterKey = rt.TypeOf<typeof afterKeyObjectRT>;

export type MetricsExplorerAggregation = rt.TypeOf<typeof metricsExplorerAggregationRT>;

export type MetricsExplorerColumnType = rt.TypeOf<typeof metricsExplorerColumnTypeRT>;

export type MetricsExplorerMetric = rt.TypeOf<typeof metricsExplorerMetricRT>;

export type MetricsExplorerPageInfo = rt.TypeOf<typeof metricsExplorerPageInfoRT>;

export type MetricsExplorerColumn = rt.TypeOf<typeof metricsExplorerColumnRT>;

export type MetricsExplorerRow = rt.TypeOf<typeof metricsExplorerRowRT>;

export type MetricsExplorerSeries = rt.TypeOf<typeof metricsExplorerSeriesRT>;

export type MetricsExplorerRequestBody = rt.TypeOf<typeof metricsExplorerRequestBodyRT>;

export type MetricsExplorerResponse = rt.TypeOf<typeof metricsExplorerResponseRT>;
