import anyTest, { TestFn } from 'ava'
import {
  createSendEmail,
  createSubscriber,
} from './sns'
const test = anyTest as TestFn<{ snsClient: any, params }>;

test.beforeEach(async t => {
  t.context.params = {
    Message: "Hello test",
    Subject: "Testing send email",
    TopicArn: 'aws.comelld::arn:sns'
  }
  t.context.snsClient = {
    publish: (params) => ({ promise: () => Promise.resolve({ params }) }),
    subscribe: (params) => ({ promise: () => Promise.resolve({ params }) })
  }
})


test('Check send email', async t => {
  t.truthy(createSendEmail)
  const { snsClient, params } = t.context
  const client = createSendEmail({ snsClient })
  t.truthy(client)
  await client(params)
  t.pass()
})

test('Check create subscriber', async t => {
  t.truthy(createSendEmail)
  const { snsClient, params } = t.context
  const client = createSubscriber({ snsClient })
  t.truthy(client)
  await client(params)
  t.pass()
})
