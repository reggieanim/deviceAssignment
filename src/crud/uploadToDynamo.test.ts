import anyTest, { TestFn } from 'ava';
import { generateMessage } from './uploadToDynamo'
import uploadToDynamo from './uploadToDynamo'
const test = anyTest as TestFn<{ config: any, getFromS3: any, createAWSStorageClient, createSendEmail: any, payload: any }>;

test.beforeEach(async t => {
    t.context.getFromS3 = () => Promise.resolve({
        Body: {
            toString: () => JSON.stringify([{ data: "random" }])
        }
    })
    t.context.config = {
        sns: {
            topicArn: "topicArn"
        },
        dynamodb: {
            table: 'randomTable'
        }
    }
    t.context.createAWSStorageClient = {
        put: () => Promise.resolve()
    }
    t.context.createSendEmail = () => Promise.resolve()
    t.context.payload = {
        body: {
            Records: [{ s3: { object: { key: '123' } } }]
        }
    }
})

test('Check uploadToDynamo', async t => {
    t.truthy(uploadToDynamo)
    const { getFromS3, config, createAWSStorageClient, createSendEmail, payload } = t.context
    const upload = uploadToDynamo({ getFromS3, config, createAWSStorageClient, createSendEmail })
    await upload(payload)
    t.pass()
})


test('Check generate message', async t => {
    t.truthy(generateMessage)
    const message = generateMessage({ failed: 100, passed: 800, time: '21st December' })
    t.is(message, '---------------- SUMMARY --------------------\nExecution completed at 21st December\nTotal number of records processed: 900\nAccepted: 800\nRejected: 100\n\n\n--------------------------------------------------------')
})
