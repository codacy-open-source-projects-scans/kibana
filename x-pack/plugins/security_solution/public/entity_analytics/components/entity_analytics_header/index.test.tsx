/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { EntityAnalyticsHeader } from '.';
import { Direction, RiskScoreFields, RiskSeverity } from '../../../../common/search_strategy';
import { TestProviders } from '../../../common/mock';
import { hostsActions } from '../../../explore/hosts/store';
import { HostsType } from '../../../explore/hosts/store/model';
import { usersActions } from '../../../explore/users/store';
import { UsersTableType } from '../../../explore/users/store/model';

import type { SeverityCount } from '../severity/types';

const mockSeverityCount: SeverityCount = {
  [RiskSeverity.Low]: 1,
  [RiskSeverity.High]: 1,
  [RiskSeverity.Moderate]: 1,
  [RiskSeverity.Unknown]: 1,
  [RiskSeverity.Critical]: 99,
};

jest.mock('../../../common/components/ml/hooks/use_ml_capabilities', () => ({
  useMlCapabilities: () => ({ isPlatinumOrTrialLicense: true, capabilities: {} }),
}));

jest.mock('../../api/hooks/use_risk_score_kpi', () => {
  return {
    useRiskScoreKpi: () => ({ severityCount: mockSeverityCount }),
  };
});

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux');
  return {
    ...original,
    useDispatch: () => mockDispatch,
  };
});

describe('Entity analytics header', () => {
  it('renders critical hosts', async () => {
    const { getByTestId } = render(
      <TestProviders>
        <EntityAnalyticsHeader />
      </TestProviders>
    );
    await waitFor(() => {
      expect(getByTestId('critical_hosts_quantity')).toHaveTextContent('99');
    });
  });

  it('renders critical users', async () => {
    const { getByTestId } = render(
      <TestProviders>
        <EntityAnalyticsHeader />
      </TestProviders>
    );

    await waitFor(() => {
      expect(getByTestId('critical_users_quantity')).toHaveTextContent('99');
    });
  });

  it('dispatches user risk tab filters actions', async () => {
    const { getByTestId } = render(
      <TestProviders>
        <EntityAnalyticsHeader />
      </TestProviders>
    );

    act(() => {
      fireEvent.click(getByTestId('critical_users_link'));
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        usersActions.updateUserRiskScoreSeverityFilter({
          severitySelection: [RiskSeverity.Critical],
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        usersActions.updateTableSorting({
          sort: { field: RiskScoreFields.userRiskScore, direction: Direction.desc },
          tableType: UsersTableType.risk,
        })
      );
    });
  });

  it('dispatches host risk tab filters actions', async () => {
    const { getByTestId } = render(
      <TestProviders>
        <EntityAnalyticsHeader />
      </TestProviders>
    );

    act(() => {
      fireEvent.click(getByTestId('critical_hosts_link'));
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        hostsActions.updateHostRiskScoreSeverityFilter({
          severitySelection: [RiskSeverity.Critical],
          hostsType: HostsType.page,
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        hostsActions.updateHostRiskScoreSort({
          sort: { field: RiskScoreFields.hostRiskScore, direction: Direction.desc },
          hostsType: HostsType.page,
        })
      );
    });
  });
});
