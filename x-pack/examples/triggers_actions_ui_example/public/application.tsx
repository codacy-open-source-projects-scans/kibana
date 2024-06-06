/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { Route } from '@kbn/shared-ux-router';
import { EuiPage, EuiTitle, EuiText, EuiSpacer } from '@elastic/eui';
import { AppMountParameters, CoreStart } from '@kbn/core/public';
import { TriggersAndActionsUIPublicPluginStart } from '@kbn/triggers-actions-ui-plugin/public';
import { KibanaRenderContextProvider } from '@kbn/react-kibana-context-render';
import { KibanaContextProvider } from '@kbn/kibana-react-plugin/public';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ChartsPluginSetup } from '@kbn/charts-plugin/public';
import type { DataPublicPluginStart } from '@kbn/data-plugin/public';
import type { DataViewsPublicPluginStart } from '@kbn/data-views-plugin/public';
import type { DataViewEditorStart } from '@kbn/data-view-editor-plugin/public';
import type { UnifiedSearchPublicPluginStart } from '@kbn/unified-search-plugin/public';
import { __IntlProvider as IntlProvider } from '@kbn/i18n-react';
import { TriggersActionsUiExamplePublicStartDeps } from './plugin';

import { Page } from './components/page';
import { Sidebar } from './components/sidebar';

import { RulesListSandbox } from './components/rules_list_sandbox';
import { RulesListNotifyBadgeSandbox } from './components/rules_list_notify_badge_sandbox';
import { RuleTagBadgeSandbox } from './components/rule_tag_badge_sandbox';
import { RuleTagFilterSandbox } from './components/rule_tag_filter_sandbox';
import { RuleEventLogListSandbox } from './components/rule_event_log_list_sandbox';
import { GlobalRuleEventLogListSandbox } from './components/global_rule_event_log_list_sandbox';
import { RuleStatusDropdownSandbox } from './components/rule_status_dropdown_sandbox';
import { RuleStatusFilterSandbox } from './components/rule_status_filter_sandbox';
import { AlertsTableSandbox } from './components/alerts_table_sandbox';
import { RulesSettingsLinkSandbox } from './components/rules_settings_link_sandbox';

import { RuleDefinitionSandbox } from './components/rule_form/rule_definition_sandbox';
import { RuleActionsSandbox } from './components/rule_form/rule_actions_sandbox';
import { RuleDetailsSandbox } from './components/rule_form/rule_details_sandbox';

export interface TriggersActionsUiExampleComponentParams {
  http: CoreStart['http'];
  basename: string;
  triggersActionsUi: TriggersAndActionsUIPublicPluginStart;
  data: DataPublicPluginStart;
  charts: ChartsPluginSetup;
  dataViews: DataViewsPublicPluginStart;
  dataViewsEditor: DataViewEditorStart;
  unifiedSearch: UnifiedSearchPublicPluginStart;
}

const TriggersActionsUiExampleApp = ({
  basename,
  triggersActionsUi,
  data,
  charts,
  dataViews,
  unifiedSearch,
}: TriggersActionsUiExampleComponentParams) => {
  return (
    <Router basename={basename}>
      <EuiPage>
        <Sidebar />
        <Route
          exact
          path="/"
          render={() => (
            <Page title="Home" isHome>
              <EuiTitle size="l">
                <h1>Welcome to the Triggers Actions UI plugin example</h1>
              </EuiTitle>
              <EuiSpacer />
              <EuiText>
                This example plugin displays the shareable components in the Triggers Actions UI
                plugin. It also serves as a sandbox to run functional tests to ensure the shareable
                components are functioning correctly outside of their original plugin.
              </EuiText>
            </Page>
          )}
        />
        <Route
          path="/rules_list"
          render={() => (
            <Page title="Rules List">
              <RulesListSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/rules_list_notify_badge"
          render={() => (
            <Page title="Rule List Notify Badge">
              <RulesListNotifyBadgeSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/rule_tag_badge"
          render={() => (
            <Page title="Rule Tag Badge">
              <RuleTagBadgeSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/rule_tag_filter"
          render={() => (
            <Page title="Rule Tag Filter">
              <RuleTagFilterSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/rule_event_log_list"
          render={() => (
            <Page title="Run History List">
              <RuleEventLogListSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/global_rule_event_log_list"
          render={() => (
            <Page title="Global Run History List">
              <GlobalRuleEventLogListSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/rule_status_dropdown"
          render={() => (
            <Page title="Rule Status Dropdown">
              <RuleStatusDropdownSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/rule_status_filter"
          render={() => (
            <Page title="Rule Status Filter">
              <RuleStatusFilterSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/alerts_table"
          render={() => (
            <Page title="Alerts Table">
              <AlertsTableSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/rules_settings_link"
          render={() => (
            <Page title="Rules Settings Link">
              <RulesSettingsLinkSandbox triggersActionsUi={triggersActionsUi} />
            </Page>
          )}
        />
        <Route
          path="/rule_definition"
          render={() => (
            <Page title="Rule Definition">
              <RuleDefinitionSandbox
                triggersActionsUi={triggersActionsUi}
                data={data}
                charts={charts}
                dataViews={dataViews}
                unifiedSearch={unifiedSearch}
              />
            </Page>
          )}
        />
        <Route
          path="/rule_actions"
          render={() => (
            <Page title="Rule Actions">
              <RuleActionsSandbox />
            </Page>
          )}
        />
        <Route
          path="/rule_details"
          render={() => (
            <Page title="Rule Details">
              <RuleDetailsSandbox />
            </Page>
          )}
        />
      </EuiPage>
    </Router>
  );
};

export const queryClient = new QueryClient();

export const renderApp = (
  core: CoreStart,
  deps: TriggersActionsUiExamplePublicStartDeps,
  { appBasePath, element }: AppMountParameters
) => {
  const { http } = core;
  const { triggersActionsUi } = deps;
  const { ruleTypeRegistry, actionTypeRegistry } = triggersActionsUi;
  ReactDOM.render(
    <KibanaRenderContextProvider {...core}>
      <KibanaContextProvider
        services={{
          ...core,
          ...deps,
          ruleTypeRegistry,
          actionTypeRegistry,
        }}
      >
        <IntlProvider locale="en">
          <QueryClientProvider client={queryClient}>
            <TriggersActionsUiExampleApp
              basename={appBasePath}
              http={http}
              triggersActionsUi={deps.triggersActionsUi}
              data={deps.data}
              charts={deps.charts}
              dataViews={deps.dataViews}
              dataViewsEditor={deps.dataViewsEditor}
              unifiedSearch={deps.unifiedSearch}
            />
          </QueryClientProvider>
        </IntlProvider>
      </KibanaContextProvider>
    </KibanaRenderContextProvider>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
