/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import {
  ALERT_BUILDING_BLOCK_TYPE,
  ALERT_REASON,
  ALERT_RISK_SCORE,
  ALERT_RULE_AUTHOR,
  ALERT_RULE_CATEGORY,
  ALERT_RULE_CONSUMER,
  ALERT_RULE_CREATED_AT,
  ALERT_RULE_CREATED_BY,
  ALERT_RULE_DESCRIPTION,
  ALERT_RULE_ENABLED,
  ALERT_RULE_EXECUTION_UUID,
  ALERT_RULE_FROM,
  ALERT_RULE_INTERVAL,
  ALERT_RULE_LICENSE,
  ALERT_RULE_NAME,
  ALERT_RULE_NAMESPACE_FIELD,
  ALERT_RULE_NOTE,
  ALERT_RULE_PARAMETERS,
  ALERT_RULE_PRODUCER,
  ALERT_RULE_REFERENCES,
  ALERT_RULE_RULE_ID,
  ALERT_RULE_RULE_NAME_OVERRIDE,
  ALERT_RULE_TAGS,
  ALERT_RULE_TO,
  ALERT_RULE_TYPE,
  ALERT_RULE_TYPE_ID,
  ALERT_RULE_UPDATED_AT,
  ALERT_RULE_UPDATED_BY,
  ALERT_RULE_UUID,
  ALERT_RULE_VERSION,
  ALERT_SEVERITY,
  ALERT_STATUS,
  ALERT_STATUS_ACTIVE,
  ALERT_URL,
  ALERT_UUID,
  ALERT_WORKFLOW_ASSIGNEE_IDS,
  ALERT_WORKFLOW_STATUS,
  ALERT_WORKFLOW_TAGS,
  EVENT_KIND,
  SPACE_IDS,
  TIMESTAMP,
} from '@kbn/rule-data-utils';

import type { EventsForEnrichment } from '../types';
import type { BaseFieldsLatest } from '../../../../../../../common/api/detection_engine/model/alerts';

import {
  ALERT_ANCESTORS,
  ALERT_DEPTH,
  ALERT_ORIGINAL_TIME,
  ALERT_RULE_ACTIONS,
  ALERT_RULE_EXCEPTIONS_LIST,
  ALERT_RULE_FALSE_POSITIVES,
  ALERT_RULE_IMMUTABLE,
  ALERT_RULE_MAX_SIGNALS,
  ALERT_RULE_RISK_SCORE_MAPPING,
  ALERT_RULE_SEVERITY_MAPPING,
  ALERT_RULE_THREAT,
  ALERT_RULE_THROTTLE,
  ALERT_RULE_TIMELINE_ID,
  ALERT_RULE_TIMELINE_TITLE,
  ALERT_RULE_INDICES,
  ALERT_RULE_TIMESTAMP_OVERRIDE,
  ALERT_HOST_CRITICALITY,
  ALERT_USER_CRITICALITY,
  LEGACY_ALERT_HOST_CRITICALITY,
  LEGACY_ALERT_USER_CRITICALITY,
  ALERT_HOST_RISK_SCORE_CALCULATED_LEVEL,
  ALERT_HOST_RISK_SCORE_CALCULATED_SCORE_NORM,
  ALERT_USER_RISK_SCORE_CALCULATED_LEVEL,
  ALERT_USER_RISK_SCORE_CALCULATED_SCORE_NORM,
} from '../../../../../../../common/field_maps/field_names';

export const createAlert = (
  someUuid: string = '1',
  data?: object
): EventsForEnrichment<BaseFieldsLatest> => ({
  _id: someUuid,
  _source: {
    someKey: 'someValue',

    [TIMESTAMP]: '2020-04-20T21:27:45+0000',
    [SPACE_IDS]: ['default'],
    [EVENT_KIND]: 'signal',
    [ALERT_RULE_CONSUMER]: '',
    [ALERT_RULE_TIMESTAMP_OVERRIDE]: undefined,
    [ALERT_ANCESTORS]: [
      {
        id: 'd5e8eb51-a6a0-456d-8a15-4b79bfec3d71',
        type: 'event',
        index: 'myFakeSignalIndex',
        depth: 0,
        rule: undefined,
      },
    ],
    [ALERT_BUILDING_BLOCK_TYPE]: undefined,
    [ALERT_ORIGINAL_TIME]: undefined,
    [ALERT_STATUS]: ALERT_STATUS_ACTIVE,
    [ALERT_WORKFLOW_STATUS]: 'open',
    [ALERT_WORKFLOW_TAGS]: [],
    [ALERT_WORKFLOW_ASSIGNEE_IDS]: [],
    [ALERT_DEPTH]: 1,
    [ALERT_REASON]: 'reasonable reason',
    [ALERT_SEVERITY]: 'high',
    [ALERT_RISK_SCORE]: 50,
    [ALERT_RULE_ACTIONS]: [],
    [ALERT_RULE_AUTHOR]: ['Elastic'],
    [ALERT_RULE_CATEGORY]: 'Custom Query Rule',
    [ALERT_RULE_CREATED_AT]: '2020-03-27T22:55:59.577Z',
    [ALERT_RULE_CREATED_BY]: 'sample user',
    [ALERT_RULE_DESCRIPTION]: 'Descriptive description',
    [ALERT_RULE_ENABLED]: true,
    [ALERT_RULE_EXCEPTIONS_LIST]: [],
    [ALERT_RULE_EXECUTION_UUID]: '97e8f53a-4971-4935-bb54-9b8f86930cc7',
    [ALERT_RULE_FALSE_POSITIVES]: [],
    [ALERT_RULE_FROM]: 'now-6m',
    [ALERT_RULE_IMMUTABLE]: false,
    [ALERT_RULE_INTERVAL]: '5m',
    [ALERT_RULE_INDICES]: ['auditbeat-*'],
    [ALERT_RULE_LICENSE]: 'Elastic License',
    [ALERT_RULE_MAX_SIGNALS]: 10000,
    [ALERT_RULE_NAME]: 'rule-name',
    [ALERT_RULE_NAMESPACE_FIELD]: undefined,
    [ALERT_RULE_NOTE]: undefined,
    [ALERT_RULE_PRODUCER]: 'siem',
    [ALERT_RULE_REFERENCES]: ['http://example.com', 'https://example.com'],
    [ALERT_RULE_RISK_SCORE_MAPPING]: [],
    [ALERT_RULE_RULE_ID]: 'rule-1',
    [ALERT_RULE_RULE_NAME_OVERRIDE]: undefined,
    [ALERT_RULE_TYPE_ID]: 'siem.queryRule',
    [ALERT_RULE_SEVERITY_MAPPING]: [],
    [ALERT_RULE_TAGS]: ['some fake tag 1', 'some fake tag 2'],
    [ALERT_RULE_THREAT]: [
      {
        framework: 'MITRE ATT&CK',
        tactic: {
          id: 'TA0000',
          name: 'test tactic',
          reference: 'https://attack.mitre.org/tactics/TA0000/',
        },
        technique: [
          {
            id: 'T0000',
            name: 'test technique',
            reference: 'https://attack.mitre.org/techniques/T0000/',
            subtechnique: [
              {
                id: 'T0000.000',
                name: 'test subtechnique',
                reference: 'https://attack.mitre.org/techniques/T0000/000/',
              },
            ],
          },
        ],
      },
    ],
    [ALERT_RULE_THROTTLE]: 'no_actions',
    [ALERT_RULE_TIMELINE_ID]: 'some-timeline-id',
    [ALERT_RULE_TIMELINE_TITLE]: 'some-timeline-title',
    [ALERT_RULE_TO]: 'now',
    [ALERT_RULE_TYPE]: 'query',
    [ALERT_RULE_UPDATED_AT]: '2020-03-27T22:55:59.577Z',
    [ALERT_RULE_UPDATED_BY]: 'sample user',
    [ALERT_RULE_UUID]: '2e051244-b3c6-4779-a241-e1b4f0beceb9',
    [ALERT_RULE_VERSION]: 1,
    [ALERT_UUID]: someUuid,
    [ALERT_URL]: `http://kibanaurl.com/app/security/alerts/redirect/${someUuid}?index=myFakeSignalIndex&timestamp=2020-04-20T21:27:45`,
    'kibana.alert.rule.risk_score': 50,
    'kibana.alert.rule.severity': 'high',
    'kibana.alert.rule.building_block_type': undefined,
    [ALERT_RULE_PARAMETERS]: {
      description: 'Descriptive description',
      meta: { someMeta: 'someField' },
      timeline_id: 'some-timeline-id',
      timeline_title: 'some-timeline-title',
      risk_score: 50,
      severity: 'high',
      note: 'Noteworthy notes',
      license: 'Elastic License',
      author: ['Elastic'],
      false_positives: [],
      from: 'now-6m',
      rule_id: 'rule-1',
      max_signals: 10000,
      risk_score_mapping: [],
      severity_mapping: [],
      to: 'now',
      references: ['http://example.com', 'https://example.com'],
      version: 1,
      immutable: false,
      namespace: 'default',
      output_index: '',
      building_block_type: undefined,
      exceptions_list: [],
      rule_name_override: undefined,
      timestamp_override: undefined,
    },
    [LEGACY_ALERT_HOST_CRITICALITY]: undefined,
    [LEGACY_ALERT_USER_CRITICALITY]: undefined,
    [ALERT_HOST_CRITICALITY]: undefined,
    [ALERT_USER_CRITICALITY]: undefined,
    [ALERT_HOST_RISK_SCORE_CALCULATED_LEVEL]: undefined,
    [ALERT_HOST_RISK_SCORE_CALCULATED_SCORE_NORM]: undefined,
    [ALERT_USER_RISK_SCORE_CALCULATED_LEVEL]: undefined,
    [ALERT_USER_RISK_SCORE_CALCULATED_SCORE_NORM]: undefined,
    ...data,
  },
});