/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const maintenanceWindowStatus = {
  RUNNING: 'running',
  UPCOMING: 'upcoming',
  FINISHED: 'finished',
  ARCHIVED: 'archived',
} as const;

export const maintenanceWindowCategoryIdTypes = {
  OBSERVABILITY: 'observability',
  SECURITY_SOLUTION: 'securitySolution',
  MANAGEMENT: 'management',
} as const;

export const filterStateStore = {
  APP_STATE: 'appState',
  GLOBAL_STATE: 'globalState',
} as const;