/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { get } from 'lodash';
import { internals } from '../internals';
import { Type, TypeOptions } from './type';
import { META_FIELD_X_OAS_REF_ID } from '../oas_meta_fields';

class MyType extends Type<any> {
  constructor(opts: TypeOptions<any> = {}) {
    super(internals.any(), opts);
  }
}

test('meta', () => {
  const type = new MyType({ meta: { description: 'my description', id: 'foo' } });
  const meta = type.getSchema().describe();
  expect(get(meta, 'flags.description')).toBe('my description');
  expect(get(meta, `metas[0].${META_FIELD_X_OAS_REF_ID}`)).toBe('foo');
});
