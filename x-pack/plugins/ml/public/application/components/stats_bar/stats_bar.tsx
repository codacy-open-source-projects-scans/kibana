/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FC } from 'react';
import React from 'react';
import { useEuiTheme } from '@elastic/eui';
import type { StatsBarStat } from './stat';
import { Stat } from './stat';

interface Stats {
  total: StatsBarStat;
  failed: StatsBarStat;
}
export interface JobStatsBarStats extends Stats {
  activeNodes: StatsBarStat;
  open: StatsBarStat;
  closed: StatsBarStat;
  activeDatafeeds: StatsBarStat;
}

export interface AnalyticStatsBarStats extends Stats {
  started: StatsBarStat;
  stopped: StatsBarStat;
}

export interface ModelsBarStats {
  total: StatsBarStat;
}

export type StatsBarStats = JobStatsBarStats | AnalyticStatsBarStats | ModelsBarStats;
type StatsKey = keyof StatsBarStats;

interface StatsBarProps {
  stats: StatsBarStats;
  dataTestSub: string;
}

export const StatsBar: FC<StatsBarProps> = ({ stats, dataTestSub }) => {
  const { euiTheme } = useEuiTheme();
  const statsList = Object.keys(stats).map((k) => stats[k as StatsKey]);
  return (
    <div
      css={{ padding: euiTheme.size.m, backgroundColor: euiTheme.colors.lightestShade }}
      data-test-subj={dataTestSub}
    >
      {statsList
        .filter((s: StatsBarStat) => s.show)
        .map((s: StatsBarStat) => (
          <Stat key={s.label} stat={s} />
        ))}
    </div>
  );
};
