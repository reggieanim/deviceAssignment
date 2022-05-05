import anyTest, { TestFn } from 'ava';
import { generateMessage } from './uploadToDynamo'
import uploadToDynamo from './uploadToDynamo'
const test = anyTest as TestFn<{ config: any, getFromS3: any, createAWSStorageClient, createSendEmail: any, payload: any, createSendSesEmail: any }>;

test.beforeEach(async t => {
    t.context.getFromS3 = () => Promise.resolve({
        Body: {
            toString: () => JSON.stringify([{ data: "random" }])
        },
        Metadata: {
            notification: 'regie@gmail.com'
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
    t.context.createSendSesEmail = () => Promise.resolve()
    t.context.payload = {
        Records: [{ s3: { object: { key: '123' } } }]
    }
})

test('Check uploadToDynamo', async t => {
    t.truthy(uploadToDynamo)
    const { getFromS3, config, createAWSStorageClient, createSendEmail, payload, createSendSesEmail } = t.context
    const upload = uploadToDynamo({ getFromS3, config, createAWSStorageClient, createSendEmail, createSendSesEmail })
    await upload(JSON.stringify(payload))
    t.pass()
})


test('Check generate message', async t => {
    t.truthy(generateMessage)
    const message = generateMessage({ failed: 100, passed: 800, time: '21st December', total:900 })
    t.truthy(message)
})
