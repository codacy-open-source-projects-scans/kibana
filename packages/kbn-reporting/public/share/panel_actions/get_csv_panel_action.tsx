/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { CoreSetup, CoreStart, NotificationsSetup } from '@kbn/core/public';
import { i18n } from '@kbn/i18n';
import { firstValueFrom, Observable } from 'rxjs';

import { DataPublicPluginStart } from '@kbn/data-plugin/public';
import type { ISearchEmbeddable } from '@kbn/discover-plugin/public';
import { loadSharingDataHelpers, SEARCH_EMBEDDABLE_TYPE } from '@kbn/discover-plugin/public';
import type { IEmbeddable } from '@kbn/embeddable-plugin/public';
import { ViewMode } from '@kbn/embeddable-plugin/public';
import { LicensingPluginStart } from '@kbn/licensing-plugin/public';
import type { SavedSearch } from '@kbn/saved-search-plugin/public';
import type { UiActionsActionDefinition as ActionDefinition } from '@kbn/ui-actions-plugin/public';
import { IncompatibleActionError } from '@kbn/ui-actions-plugin/public';

import { CSV_REPORTING_ACTION } from '@kbn/reporting-export-types-csv-common';
import { checkLicense } from '../../license_check';
import { ReportingAPIClient } from '../../reporting_api_client';

function isSavedSearchEmbeddable(
  embeddable: IEmbeddable | ISearchEmbeddable
): embeddable is ISearchEmbeddable {
  return embeddable.type === SEARCH_EMBEDDABLE_TYPE;
}

export interface ActionContext {
  embeddable: ISearchEmbeddable;
}

export interface PanelActionDependencies {
  data: DataPublicPluginStart;
  licensing: LicensingPluginStart;
}

interface Params {
  apiClient: ReportingAPIClient;
  core: CoreSetup;
  startServices$: Observable<[CoreStart, PanelActionDependencies, unknown]>;
  usesUiCapabilities: boolean;
}

export class ReportingCsvPanelAction implements ActionDefinition<ActionContext> {
  private isDownloading: boolean;
  public readonly type = '';
  public readonly id = CSV_REPORTING_ACTION;
  private readonly notifications: NotificationsSetup;
  private readonly apiClient: ReportingAPIClient;
  private readonly startServices$: Params['startServices$'];
  private readonly usesUiCapabilities: boolean;

  constructor({ core, apiClient, startServices$, usesUiCapabilities }: Params) {
    this.isDownloading = false;

    this.notifications = core.notifications;
    this.apiClient = apiClient;

    this.startServices$ = startServices$;
    this.usesUiCapabilities = usesUiCapabilities;
  }

  public getIconType() {
    return 'document';
  }

  public getDisplayName() {
    return i18n.translate('reporting.share.panelAction.generateCsvPanelTitle', {
      defaultMessage: 'Download CSV',
    });
  }

  public async getSharingData(savedSearch: SavedSearch) {
    const [{ uiSettings }, { data }] = await firstValueFrom(this.startServices$);
    const { getSharingData } = await loadSharingDataHelpers();
    return await getSharingData(savedSearch.searchSource, savedSearch, { uiSettings, data });
  }

  public isCompatible = async (context: ActionContext) => {
    const { embeddable } = context;

    if (embeddable.type !== 'search') {
      return false;
    }

    const [{ application }, { licensing }] = await firstValueFrom(this.startServices$);
    const license = await firstValueFrom(licensing.license$);
    const licenseHasDownloadCsv = checkLicense(license.check('reporting', 'basic')).showLinks;
    const capabilityHasDownloadCsv = this.usesUiCapabilities
      ? application.capabilities.dashboard?.downloadCsv === true
      : true; // deprecated

    if (!licenseHasDownloadCsv || !capabilityHasDownloadCsv) {
      return false;
    }

    const savedSearch = embeddable.getSavedSearch();
    const query = savedSearch?.searchSource.getField('query');

    // using isOfAggregateQueryType(query) added increased the bundle size over the configured limit of 55.7KB
    if (query && Boolean(query && 'sql' in query)) {
      // hide exporting CSV for SQL
      return false;
    }
    return embeddable.getInput().viewMode !== ViewMode.EDIT;
  };

  public execute = async (context: ActionContext) => {
    const { embeddable } = context;

    if (!isSavedSearchEmbeddable(embeddable) || !(await this.isCompatible(context))) {
      throw new IncompatibleActionError();
    }

    const savedSearch = embeddable.getSavedSearch();

    if (!savedSearch || this.isDownloading) {
      return;
    }

    const { columns, getSearchSource } = await this.getSharingData(savedSearch);

    const immediateJobParams = this.apiClient.getDecoratedJobParams({
      searchSource: getSearchSource({
        addGlobalTimeFilter: !embeddable.hasTimeRange(),
        absoluteTime: true,
      }),
      columns,
      title: savedSearch.title || '',
      objectType: 'downloadCsv', // FIXME: added for typescript, but immediate download job does not need objectType
    });

    this.isDownloading = true;

    this.notifications.toasts.addSuccess({
      title: i18n.translate('reporting.share.panelAction.csvDownloadStartedTitle', {
        defaultMessage: `CSV Download Started`,
      }),
      text: i18n.translate('reporting.share.panelAction.csvDownloadStartedMessage', {
        defaultMessage: `Your CSV will download momentarily.`,
      }),
      'data-test-subj': 'csvDownloadStarted',
    });

    await this.apiClient
      .createImmediateReport(immediateJobParams)
      .then(({ body, response }) => {
        this.isDownloading = false;

        const download = `${savedSearch.title}.csv`;
        const blob = new Blob([body as BlobPart], {
          type: response?.headers.get('content-type') || undefined,
        });

        // Hack for IE11 Support
        // @ts-expect-error
        if (window.navigator.msSaveOrOpenBlob) {
          // @ts-expect-error
          return window.navigator.msSaveOrOpenBlob(blob, download);
        }

        const a = window.document.createElement('a');
        const downloadObject = window.URL.createObjectURL(blob);

        a.href = downloadObject;
        a.download = download;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadObject);
        document.body.removeChild(a);
      })
      .catch(this.onGenerationFail.bind(this));
  };

  private onGenerationFail(_error: Error) {
    this.isDownloading = false;
    this.notifications.toasts.addDanger({
      title: i18n.translate('reporting.share.panelAction.failedCsvReportTitle', {
        defaultMessage: `CSV download failed`,
      }),
      text: i18n.translate('reporting.share.panelAction.failedCsvReportMessage', {
        defaultMessage: `We couldn't generate your CSV at this time.`,
      }),
      'data-test-subj': 'downloadCsvFail',
    });
  }
}