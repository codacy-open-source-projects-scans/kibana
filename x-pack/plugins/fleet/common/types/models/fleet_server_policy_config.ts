/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// SO definition for this type is declared in server/types/interfaces
export interface NewFleetServerHost {
  name: string;
  host_urls: string[];
  is_default: boolean;
  is_preconfigured: boolean;
  is_internal?: boolean;
  proxy_id?: string | null;
}

export interface FleetServerHost extends NewFleetServerHost {
  id: string;
}
