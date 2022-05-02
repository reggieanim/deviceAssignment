import anyTest, { TestFn } from 'ava';
import { config } from '../../../config'
import { createS3Client } from './s3'
const test = anyTest as TestFn<{ config: any }>;

test.beforeEach(async t => {
  t.context.config = config
})

test('Check dynamodb client', async t => {
  const config = t.context.config
  t.truthy(createS3Client)
  const client = createS3Client({ config })
  t.truthy(client)
})
