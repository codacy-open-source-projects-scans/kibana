/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiSpacer } from '@elastic/eui';
import { mount } from 'enzyme';
import { nextTick } from '@kbn/test-jest-helpers';
import { shallowWithIntl } from '@kbn/test-jest-helpers';
import { ChartWrapper } from './chart_wrapper';
import { SnapshotHeading } from '../../overview/snapshot/snapshot_heading';
import { DonutChart } from './donut_chart';
import { mockCore } from '../../../lib/helper/rtl_helpers';
const SNAPSHOT_CHART_HEIGHT = 144;

jest.mock('@kbn/kibana-react-plugin/public', () => ({
  useKibana: jest.fn().mockImplementation(() => ({
    services: mockCore(),
  })),
}));

describe('ChartWrapper component', () => {
  it('renders the component with loading false', () => {
    const component = shallowWithIntl(
      <ChartWrapper loading={false}>
        <SnapshotHeading total={12} />
        <EuiSpacer size="xs" />
        <DonutChart up={4} down={8} height={SNAPSHOT_CHART_HEIGHT} />
      </ChartWrapper>
    );
    expect(component).toMatchSnapshot();
  });

  it('renders the component with loading true', () => {
    const component = shallowWithIntl(
      <ChartWrapper loading={true}>
        <SnapshotHeading total={12} />
        <EuiSpacer size="xs" />
        <DonutChart up={4} down={8} height={SNAPSHOT_CHART_HEIGHT} />
      </ChartWrapper>
    );
    expect(component).toMatchSnapshot();
  });

  it('mounts the component with loading true or false', async () => {
    const component = mount(
      <ChartWrapper loading={true}>
        <SnapshotHeading total={12} />
        <EuiSpacer size="xs" />
        <DonutChart up={4} down={8} height={SNAPSHOT_CHART_HEIGHT} />
      </ChartWrapper>
    );

    // Added span because class appears twice with classNames and Emotion
    let loadingChart = component.find(`span.euiLoadingChart`);
    expect(loadingChart.length).toBe(1);

    component.setProps({
      loading: false,
    });
    await nextTick();
    component.update();

    loadingChart = component.find(`.euiLoadingChart`);
    expect(loadingChart.length).toBe(0);
  });

  it('mounts the component with chart when loading true or false', async () => {
    const component = mount(
      <ChartWrapper loading={true}>
        <SnapshotHeading total={12} />
        <EuiSpacer size="xs" />
        <DonutChart up={4} down={8} height={SNAPSHOT_CHART_HEIGHT} />
      </ChartWrapper>
    );

    let donutChart = component.find(DonutChart);
    expect(donutChart.length).toBe(1);

    component.setProps({
      loading: false,
    });
    await nextTick();
    component.update();

    donutChart = component.find(DonutChart);
    expect(donutChart.length).toBe(1);
  });
});
