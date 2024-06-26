/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createAction } from 'redux-actions';
import { i18n } from '@kbn/i18n';

import { refreshIndices as request } from '../../services';
import { clearRowStatus, reloadIndices } from '.';
import { notificationService } from '../../services/notification';

export const refreshIndicesStart = createAction('INDEX_MANAGEMENT_REFRESH_INDICES_START');
export const refreshIndices =
  ({ indexNames }) =>
  async (dispatch) => {
    dispatch(refreshIndicesStart({ indexNames }));
    try {
      await request(indexNames);
    } catch (error) {
      notificationService.showDangerToast(error.body.message);
      return dispatch(clearRowStatus({ indexNames }));
    }
    dispatch(reloadIndices(indexNames));
    notificationService.showSuccessToast(
      i18n.translate('xpack.idxMgmt.refreshIndicesAction.successfullyRefreshedIndicesMessage', {
        defaultMessage: 'Successfully refreshed {count, plural, one {# index} other {# indices} }',
        values: { count: indexNames.length },
      })
    );
  };
