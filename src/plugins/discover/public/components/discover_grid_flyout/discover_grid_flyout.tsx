/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useMemo, useCallback } from 'react';
import { get } from 'lodash';
import { i18n } from '@kbn/i18n';
import { css } from '@emotion/react';
import type { DataView } from '@kbn/data-views-plugin/public';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyoutResizable,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiTitle,
  EuiSpacer,
  EuiPortal,
  EuiPagination,
  keys,
  EuiButtonEmpty,
  useEuiTheme,
  useIsWithinMinBreakpoint,
} from '@elastic/eui';
import { Filter, Query, AggregateQuery, isOfAggregateQueryType } from '@kbn/es-query';
import type { DataTableRecord } from '@kbn/discover-utils/types';
import type { DocViewFilterFn } from '@kbn/unified-doc-viewer/types';
import type { DataTableColumnsMeta } from '@kbn/unified-data-table';
import { UnifiedDocViewer } from '@kbn/unified-doc-viewer-plugin/public';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import { useDiscoverServices } from '../../hooks/use_discover_services';
import { useFlyoutActions } from './use_flyout_actions';
import { useDiscoverCustomization } from '../../customizations';
import { DiscoverGridFlyoutActions } from './discover_grid_flyout_actions';

export interface DiscoverGridFlyoutProps {
  savedSearchId?: string;
  filters?: Filter[];
  query?: Query | AggregateQuery;
  columns: string[];
  columnsMeta?: DataTableColumnsMeta;
  hit: DataTableRecord;
  hits?: DataTableRecord[];
  dataView: DataView;
  onAddColumn: (column: string) => void;
  onClose: () => void;
  onFilter?: DocViewFilterFn;
  onRemoveColumn: (column: string) => void;
  setExpandedDoc: (doc?: DataTableRecord) => void;
}

function getIndexByDocId(hits: DataTableRecord[], id: string) {
  return hits.findIndex((h) => {
    return h.id === id;
  });
}

export const FLYOUT_WIDTH_KEY = 'discover:flyoutWidth';
/**
 * Flyout displaying an expanded Elasticsearch document
 */
export function DiscoverGridFlyout({
  hit,
  hits,
  dataView,
  columns,
  columnsMeta,
  savedSearchId,
  filters,
  query,
  onFilter,
  onClose,
  onRemoveColumn,
  onAddColumn,
  setExpandedDoc,
}: DiscoverGridFlyoutProps) {
  const services = useDiscoverServices();
  const flyoutCustomization = useDiscoverCustomization('flyout');
  const { euiTheme } = useEuiTheme();
  const isXlScreen = useIsWithinMinBreakpoint('xl');
  const DEFAULT_WIDTH = euiTheme.base * 34;
  const defaultWidth = flyoutCustomization?.size ?? DEFAULT_WIDTH; // Give enough room to search bar to not wrap
  const [flyoutWidth, setFlyoutWidth] = useLocalStorage(FLYOUT_WIDTH_KEY, defaultWidth);
  const minWidth = euiTheme.base * 24;
  const maxWidth = euiTheme.breakpoint.xl;
  const isEsqlQuery = isOfAggregateQueryType(query);
  // Get actual hit with updated highlighted searches
  const actualHit = useMemo(() => hits?.find(({ id }) => id === hit?.id) || hit, [hit, hits]);
  const pageCount = useMemo<number>(() => (hits ? hits.length : 0), [hits]);
  const activePage = useMemo<number>(() => {
    const id = hit.id;
    if (!hits || pageCount <= 1) {
      return -1;
    }

    return getIndexByDocId(hits, id);
  }, [hits, hit, pageCount]);

  const setPage = useCallback(
    (index: number) => {
      if (hits && hits[index]) {
        setExpandedDoc(hits[index]);
      }
    },
    [hits, setExpandedDoc]
  );

  const onKeyDown = useCallback(
    (ev: React.KeyboardEvent) => {
      const nodeName = get(ev, 'target.nodeName', null);
      if (typeof nodeName === 'string' && nodeName.toLowerCase() === 'input') {
        return;
      }
      if (ev.key === keys.ARROW_LEFT || ev.key === keys.ARROW_RIGHT) {
        ev.preventDefault();
        ev.stopPropagation();
        setPage(activePage + (ev.key === keys.ARROW_RIGHT ? 1 : -1));
      }
    },
    [activePage, setPage]
  );

  const { flyoutActions } = useFlyoutActions({
    actions: flyoutCustomization?.actions,
    dataView,
    rowIndex: hit.raw._index,
    rowId: hit.raw._id,
    columns,
    filters,
    savedSearchId,
  });

  const addColumn = useCallback(
    (columnName: string) => {
      onAddColumn(columnName);
      services.toastNotifications.addSuccess(
        i18n.translate('discover.grid.flyout.toastColumnAdded', {
          defaultMessage: `Column ''{columnName}'' was added`,
          values: { columnName },
        })
      );
    },
    [onAddColumn, services.toastNotifications]
  );

  const removeColumn = useCallback(
    (columnName: string) => {
      onRemoveColumn(columnName);
      services.toastNotifications.addSuccess(
        i18n.translate('discover.grid.flyout.toastColumnRemoved', {
          defaultMessage: `Column ''{columnName}'' was removed`,
          values: { columnName },
        })
      );
    },
    [onRemoveColumn, services.toastNotifications]
  );

  const renderDefaultContent = useCallback(
    () => (
      <UnifiedDocViewer
        columns={columns}
        columnsMeta={columnsMeta}
        dataView={dataView}
        filter={onFilter}
        hit={actualHit}
        onAddColumn={addColumn}
        onRemoveColumn={removeColumn}
        textBasedHits={isEsqlQuery ? hits : undefined}
        docViewsRegistry={flyoutCustomization?.docViewsRegistry}
      />
    ),
    [
      actualHit,
      addColumn,
      columns,
      columnsMeta,
      dataView,
      hits,
      isEsqlQuery,
      onFilter,
      removeColumn,
      flyoutCustomization?.docViewsRegistry,
    ]
  );

  const contentActions = useMemo(
    () => ({
      filter: onFilter,
      onAddColumn: addColumn,
      onRemoveColumn: removeColumn,
    }),
    [onFilter, addColumn, removeColumn]
  );

  const bodyContent = flyoutCustomization?.Content ? (
    <flyoutCustomization.Content
      actions={contentActions}
      doc={actualHit}
      renderDefaultContent={renderDefaultContent}
    />
  ) : (
    renderDefaultContent()
  );

  const defaultFlyoutTitle = isEsqlQuery
    ? i18n.translate('discover.grid.tableRow.docViewerEsqlDetailHeading', {
        defaultMessage: 'Result',
      })
    : i18n.translate('discover.grid.tableRow.docViewerDetailHeading', {
        defaultMessage: 'Document',
      });
  const flyoutTitle = flyoutCustomization?.title ?? defaultFlyoutTitle;

  return (
    <EuiPortal>
      <EuiFlyoutResizable
        className="DiscoverFlyout" // used to override the z-index of the flyout from SecuritySolution
        onClose={onClose}
        type="push"
        size={flyoutWidth}
        pushMinBreakpoint="xl"
        data-test-subj="docTableDetailsFlyout"
        onKeyDown={onKeyDown}
        ownFocus={true}
        minWidth={minWidth}
        maxWidth={maxWidth}
        onResize={setFlyoutWidth}
        css={{
          maxWidth: `${isXlScreen ? `calc(100vw - ${DEFAULT_WIDTH}px)` : '90vw'} !important`,
        }}
        paddingSize="m"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiFlexGroup
            direction="row"
            alignItems="center"
            gutterSize="m"
            responsive={false}
            wrap={true}
          >
            <EuiFlexItem grow={false}>
              <EuiTitle
                size="xs"
                data-test-subj="docTableRowDetailsTitle"
                css={css`
                  white-space: nowrap;
                `}
              >
                <h2>{flyoutTitle}</h2>
              </EuiTitle>
            </EuiFlexItem>
            {activePage !== -1 && (
              <EuiFlexItem data-test-subj={`dscDocNavigationPage-${activePage}`}>
                <EuiPagination
                  aria-label={i18n.translate('discover.grid.flyout.documentNavigation', {
                    defaultMessage: 'Document navigation',
                  })}
                  pageCount={pageCount}
                  activePage={activePage}
                  onPageClick={setPage}
                  compressed
                  data-test-subj="dscDocNavigation"
                />
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
          {isEsqlQuery || !flyoutActions.length ? null : (
            <>
              <EuiSpacer size="s" />
              <DiscoverGridFlyoutActions flyoutActions={flyoutActions} />
            </>
          )}
        </EuiFlyoutHeader>
        <EuiFlyoutBody>{bodyContent}</EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiButtonEmpty iconType="cross" onClick={onClose} flush="left">
            {i18n.translate('discover.grid.flyout.close', {
              defaultMessage: 'Close',
            })}
          </EuiButtonEmpty>
        </EuiFlyoutFooter>
      </EuiFlyoutResizable>
    </EuiPortal>
  );
}

// eslint-disable-next-line import/no-default-export
export default DiscoverGridFlyout;
