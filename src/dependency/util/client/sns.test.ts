import anyTest, { TestFn } from 'ava';
import { config } from '../../../config'
import { createSNSClient } from './sns'
const test = anyTest as TestFn<{ config: any }>;

test.beforeEach(async t => {
  t.context.config = config
})

test('Check sns client', async t => {
  const config = t.context.config
  t.truthy(createSNSClient)
  const client = createSNSClient({ config })
  t.truthy(client)
})
