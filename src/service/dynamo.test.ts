import anyTest, {TestFn} from 'ava'
import * as td from 'testdouble'
import {
  createAWSStorageClient
} from './dynamo'
const test = anyTest as TestFn<{ dynamoClient: any, dynamoDocumentClient: any}>;

test.beforeEach(async t => {
  t.context.dynamoClient = {
    createTable: td.func('CreateTable')
  }
  t.context.dynamoDocumentClient = {
    put: td.func('put'),
  }
})


test('Check put into table action', async t => {
  t.truthy(createAWSStorageClient)
  const { dynamoDocumentClient } = t.context
  const client = createAWSStorageClient({ dynamoDocumentClient })
  t.truthy(client)
  const promise = () => Promise.resolve({ Attributes: {} })
  td.when(dynamoDocumentClient.put(td.matchers.isA(Object))).thenReturn({ promise })
  const options = { Item: {} }
  await client.put('myTestTableName', options)
  t.pass()
})
