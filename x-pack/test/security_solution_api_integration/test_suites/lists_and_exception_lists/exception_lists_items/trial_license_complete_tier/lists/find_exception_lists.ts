/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from 'expect';

import { EXCEPTION_LIST_URL } from '@kbn/securitysolution-list-constants';
import { getCreateExceptionListMinimalSchemaMock } from '@kbn/lists-plugin/common/schemas/request/create_exception_list_schema.mock';
import { deleteAllExceptions } from '../../../utils';

import { FtrProviderContext } from '../../../../../ftr_provider_context';

export default ({ getService }: FtrProviderContext): void => {
  const supertest = getService('supertest');
  const log = getService('log');

  describe('@ess @serverless find_exception_lists', () => {
    describe('find exception lists', () => {
      afterEach(async () => {
        await deleteAllExceptions(supertest, log);
      });

      it('should return an empty find body correctly if no exception lists are loaded', async () => {
        const { body } = await supertest
          .get(`${EXCEPTION_LIST_URL}/_find`)
          .set('kbn-xsrf', 'true')
          .send()
          .expect(200);

        expect(body).toEqual({
          data: [],
          page: 1,
          per_page: 20,
          total: 0,
        });
      });

      it('should return a single exception list when a single exception list is loaded from a find with defaults added', async () => {
        // add a single exception list
        await supertest
          .post(EXCEPTION_LIST_URL)
          .set('kbn-xsrf', 'true')
          .send(getCreateExceptionListMinimalSchemaMock())
          .expect(200);

        // query the single exception list from _find
        const { body } = await supertest
          .get(`${EXCEPTION_LIST_URL}/_find`)
          .set('kbn-xsrf', 'true')
          .send()
          .expect(200);

        expect(body).toEqual({
          data: [expect.objectContaining(getCreateExceptionListMinimalSchemaMock())],
          page: 1,
          per_page: 20,
          total: 1,
        });
      });
    });
  });
};
