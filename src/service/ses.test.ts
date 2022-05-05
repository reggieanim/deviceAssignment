import anyTest, { TestFn } from 'ava'
import {
    createSendEmail,
} from './ses'
const test = anyTest as TestFn<{ sesClient: any, params }>;

test.beforeEach(async t => {
  t.context.params = {
    Message: "Hello test",
    Subject: "Testing send email",
    TopicArn: 'aws.comelld::arn:sns'
  }
  t.context.sesClient = {
    sendEmail: (params) => ({ promise: () => Promise.resolve({ params }) }),
  }
})


test('Check send email', async t => {
  t.truthy(createSendEmail)
  const { sesClient, params } = t.context
  const client = createSendEmail({ sesClient })
  t.truthy(client)
  await client(params)
  t.pass()
})

