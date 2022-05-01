import anyTest, {TestFn} from 'ava';
import { config } from '../../../config'
import {createDynamoClient, createDynamoDocumentClient } from './dynamodb'
const test = anyTest as TestFn<{ config: any}>;

test.beforeEach(async t => {
  t.context.config = config
})

test('Check dynamodb client', async t => {
  const config = t.context.config
  t.truthy(createDynamoClient)
  const client = createDynamoClient({ config })
  t.truthy(client)
})

test('Check dynamodb document client', async t => {
  const config = t.context.config
  t.truthy(createDynamoDocumentClient)
  const client = createDynamoDocumentClient({ config })
  t.truthy(client)
})
