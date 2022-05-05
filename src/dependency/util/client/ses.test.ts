import anyTest, { TestFn } from 'ava';
import { config } from '../../../config'
import { createSESClient } from './ses'
const test = anyTest as TestFn<{ config: any }>;

test.beforeEach(async t => {
  t.context.config = config
})

test('Check ses client', async t => {
  const config = t.context.config
  t.truthy(createSESClient)
  const client = createSESClient({ config })
  t.truthy(client)
})
