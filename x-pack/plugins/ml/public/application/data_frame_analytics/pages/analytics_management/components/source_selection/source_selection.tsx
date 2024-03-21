/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FC } from 'react';
import React, { useState } from 'react';
import { EuiCallOut, EuiPageBody, EuiPanel, EuiSpacer } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { getNestedProperty } from '@kbn/ml-nested-property';
import { SavedObjectFinder } from '@kbn/saved-objects-finder-plugin/public';
import type { SavedObjectCommon } from '@kbn/saved-objects-finder-plugin/common';
import { CreateDataViewButton } from '../../../../../components/create_data_view_button';
import { useMlKibana, useNavigateToPath } from '../../../../../contexts/kibana';
import { useToastNotificationService } from '../../../../../services/toast_notification_service';
import {
  getDataViewAndSavedSearchCallback,
  isCcsIndexPattern,
} from '../../../../../util/index_utils';

const fixedPageSize: number = 20;

export const SourceSelection: FC = () => {
  const {
    services: {
      savedSearch: savedSearchService,
      data: { dataViews: dataViewsService },
      contentManagement,
      uiSettings,
    },
  } = useMlKibana();
  const navigateToPath = useNavigateToPath();

  const [isCcsCallOut, setIsCcsCallOut] = useState(false);
  const [ccsCallOutBodyText, setCcsCallOutBodyText] = useState<string>();
  const toastNotificationService = useToastNotificationService();

  const onSearchSelected = async (
    id: string,
    type: string,
    fullName?: string,
    savedObject?: SavedObjectCommon
  ) => {
    // Kibana data views including `:` are cross-cluster search indices
    // and are not supported by Data Frame Analytics yet. For saved searches
    // and data views that use cross-cluster search we intercept
    // the selection before redirecting and show an error callout instead.
    let dataViewName = '';

    if (type === 'index-pattern' && savedObject) {
      dataViewName = getNestedProperty(savedObject, 'attributes.title');
    } else if (type === 'search') {
      try {
        const dataViewAndSavedSearch = await getDataViewAndSavedSearchCallback({
          savedSearchService,
          dataViewsService,
        })(id);
        dataViewName = dataViewAndSavedSearch.dataView?.title ?? '';
      } catch (error) {
        // an unexpected error has occurred. This could be caused by a saved search for which the data view no longer exists.
        toastNotificationService.displayErrorToast(
          error,
          i18n.translate(
            'xpack.ml.dataFrame.analytics.create.searchSelection.errorGettingDataViewTitle',
            {
              defaultMessage: 'Error loading data view used by the saved search',
            }
          )
        );
        return;
      }
    }

    if (isCcsIndexPattern(dataViewName) && savedObject) {
      setIsCcsCallOut(true);
      if (type === 'search') {
        setCcsCallOutBodyText(
          i18n.translate(
            'xpack.ml.dataFrame.analytics.create.searchSelection.CcsErrorCallOutBody',
            {
              defaultMessage: `The saved search '{savedSearchTitle}' uses the data view '{dataViewName}'.`,
              values: {
                savedSearchTitle: getNestedProperty(savedObject, 'attributes.title'),
                dataViewName,
              },
            }
          )
        );
      } else {
        setCcsCallOutBodyText(undefined);
      }
      return;
    }

    await navigateToPath(
      `/data_frame_analytics/new_job?${
        type === 'index-pattern' ? 'index' : 'savedSearchId'
      }=${encodeURIComponent(id)}`
    );
  };

  return (
    <div data-test-subj="mlDFAPageSourceSelection">
      <EuiPageBody restrictWidth={1200}>
        <EuiPanel hasShadow={false} hasBorder>
          {isCcsCallOut && (
            <>
              <EuiCallOut
                data-test-subj="analyticsCreateSourceIndexModalCcsErrorCallOut"
                title={i18n.translate(
                  'xpack.ml.dataFrame.analytics.create.searchSelection.CcsErrorCallOutTitle',
                  {
                    defaultMessage: 'Data views using cross-cluster search are not supported.',
                  }
                )}
                color="danger"
              >
                {typeof ccsCallOutBodyText === 'string' && <p>{ccsCallOutBodyText}</p>}
              </EuiCallOut>
              <EuiSpacer size="m" />
            </>
          )}
          <SavedObjectFinder
            key="searchSavedObjectFinder"
            onChoose={onSearchSelected}
            showFilter
            noItemsMessage={i18n.translate(
              'xpack.ml.dataFrame.analytics.create.searchSelection.notFoundLabel',
              {
                defaultMessage: 'No matching indices or saved searches found.',
              }
            )}
            savedObjectMetaData={[
              {
                type: 'search',
                getIconForSavedObject: () => 'search',
                name: i18n.translate(
                  'xpack.ml.dataFrame.analytics.create.searchSelection.savedObjectType.search',
                  {
                    defaultMessage: 'Saved search',
                  }
                ),
              },
              {
                type: 'index-pattern',
                getIconForSavedObject: () => 'indexPatternApp',
                name: i18n.translate(
                  'xpack.ml.dataFrame.analytics.create.searchSelection.savedObjectType.dataView',
                  {
                    defaultMessage: 'Data view',
                  }
                ),
              },
            ]}
            fixedPageSize={fixedPageSize}
            services={{
              contentClient: contentManagement.client,
              uiSettings,
            }}
          >
            <CreateDataViewButton onDataViewCreated={onSearchSelected} allowAdHocDataView={true} />
          </SavedObjectFinder>
        </EuiPanel>
      </EuiPageBody>
    </div>
  );
};