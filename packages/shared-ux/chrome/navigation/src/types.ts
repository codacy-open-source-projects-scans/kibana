/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { Observable } from 'rxjs';
import type { IBasePath } from '@kbn/core-http-browser';
import type { ApplicationStart } from '@kbn/core-application-browser';

import type {
  ChromeNavLink,
  ChromeProjectNavigationNode,
  ChromeRecentlyAccessedHistoryItem,
} from '@kbn/core-chrome-browser';

type BasePathService = Pick<IBasePath, 'prepend'>;

/**
 * @internal
 */

export type NavigateToUrlFn = ApplicationStart['navigateToUrl'];

/**
 * A list of services that are consumed by this component.
 * @public
 */
export interface NavigationServices {
  basePath: BasePathService;
  recentlyAccessed$: Observable<ChromeRecentlyAccessedHistoryItem[]>;
  navIsOpen: boolean;
  navigateToUrl: NavigateToUrlFn;
  activeNodes$: Observable<ChromeProjectNavigationNode[][]>;
  isSideNavCollapsed: boolean;
}

/**
 * An interface containing a collection of Kibana dependencies required to
 * render this component
 * @public
 */
export interface NavigationKibanaDependencies {
  core: {
    application: { navigateToUrl: NavigateToUrlFn };
    chrome: {
      recentlyAccessed: { get$: () => Observable<ChromeRecentlyAccessedHistoryItem[]> };
      navLinks: {
        getNavLinks$: () => Observable<Readonly<ChromeNavLink[]>>;
      };
      getIsSideNavCollapsed$: () => Observable<boolean>;
    };
    http: {
      basePath: BasePathService;
      getLoadingCount$(): Observable<number>;
    };
  };
  activeNodes$: Observable<ChromeProjectNavigationNode[][]>;
}
