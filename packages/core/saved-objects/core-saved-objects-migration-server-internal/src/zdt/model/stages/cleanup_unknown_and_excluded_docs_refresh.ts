/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as Either from 'fp-ts/lib/Either';
import { throwBadResponse } from '../../../model/helpers';
import type { ModelStage } from '../types';

export const cleanupUnknownAndExcludedDocsRefresh: ModelStage<
  'CLEANUP_UNKNOWN_AND_EXCLUDED_DOCS_REFRESH',
  'OUTDATED_DOCUMENTS_SEARCH_OPEN_PIT'
> = (state, res, context) => {
  if (Either.isLeft(res)) {
    throwBadResponse(state, res as never);
  }

  return {
    ...state,
    controlState: 'OUTDATED_DOCUMENTS_SEARCH_OPEN_PIT',
  };
};
