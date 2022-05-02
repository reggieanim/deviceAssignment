import { map as mapAwait } from 'awaiting'
import { type Config } from '../config'
import createLogger from '../dependency/util/logger'

let completed: any[] = []
let failed: any[] = []

interface Client {
  put: (tableName: string, data: any) => {}
}
export const generateMessage = ({ failed, passed, time }: { failed: number, passed: number, time: string }): string => {
  const totalRecords: number = failed + passed
  return `---------------- SUMMARY --------------------\nExecution completed at ${time}\nTotal number of records processed: ${totalRecords}\nAccepted: ${passed}\nRejected: ${failed}\n\n\n--------------------------------------------------------`
}
const createPutDeviceToDynamo = ({ client, tableName }: { client: Client, tableName: string }) => async (data: any) => {
  try {
    await client.put(tableName, data)
    completed.push(data)
  }
  catch (err) {
    console.log(err)
    failed.push(data)
  }
}

export default ({ getFromS3, createAWSStorageClient, createSendEmail, config }: { getFromS3: (key: string) => any, createAWSStorageClient: Client, config: Config, createSendEmail: (params) => {} }) => async input => {
  const log = createLogger('uploadToDynamo')
  const data = JSON.parse(input)
  const key = data?.Records[0]?.s3?.object?.key
  const dynamoTableName: string = config?.dynamodb?.table
  log('Running pipeline')
  try {
    const response = await getFromS3(key)
    const data = response.Body.toString('utf-8')
    const payload = JSON.parse(data)
    const topicArn: string = config?.sns?.topicArn
    const storageClient: Client = createAWSStorageClient
    const date: string = new Date().toUTCString()
    const putDeviceToDynamo = createPutDeviceToDynamo({ client: storageClient, tableName: dynamoTableName })
    await mapAwait(payload, payload.length, putDeviceToDynamo)
    const params = {
      Message: generateMessage({ failed: failed.length, passed: completed.length, time: date }),
      Subject: "Devices upload successfully",
      TopicArn: topicArn
    }
    await createSendEmail(params)
    console.log('done successfully')
    console.log(completed)
    console.log(failed)
    return
  } catch (e) {
    console.error(e)
  }
}
