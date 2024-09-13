/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import ReactDOM from 'react-dom';

import { AppMountParameters } from '@kbn/core/public';
import { ManagementApp, ManagementAppDependencies } from './components/management_app';

export const renderApp = async (
  { history, appBasePath, element, theme$ }: AppMountParameters,
  dependencies: ManagementAppDependencies
) => {
  ReactDOM.render(<ManagementApp {...{ history, appBasePath, theme$, dependencies }} />, element);
  return () => ReactDOM.unmountComponentAtNode(element);
};
