import { map as mapAwait } from 'awaiting'
import { type Config } from '../config'
import createLogger from '../dependency/util/logger'

interface Client {
  put: (tableName: string, data: any) => {}
}
export const generateMessage = ({ failed, passed, total, time }: { failed: number, passed: number, total: number, time: string }): string => {
  // const totalRecords: number = total
  // return `---------------- SUMMARY --------------------\nExecution completed at ${time}\nTotal number of records processed: ${totalRecords}\nAccepted: ${passed}\nRejected: ${failed}\n\n\n--------------------------------------------------------`
  return `<!DOCTYPE html>
  <html>
  
  <head></head>
  
  <body>
      <h3>---------------- SUMMARY --------------------</h3> <br>
      <h3>Execution completed at ${time}</h3><br>
      <h3>Total number of records processed: ${total}</h3><br>
      <h3>Accepted: ${passed}</h3><br>
      <h3>Failed: ${failed}</h3><br>
      <h3>--------------------------------------------------------</h3>
  </body>
  
  </html>`
}

const createPutDeviceToDynamo = ({ client, tableName }: { client: Client, tableName: string }) => async (data: any) => {
  let completed: any[] = []
  let failed: any[] = []
  const putIntoDynamo = async (record) => {
    try {
      await client.put(tableName, record)
      completed.push(record)
    }
    catch (err) {
      console.log(err)
      failed.push(record)
    }
  }
  await mapAwait(data, data.length, putIntoDynamo)
  return { completed: completed, failed, total: data.length }
}

export default ({ getFromS3, createAWSStorageClient, createSendSesEmail, config }: { getFromS3: (key: string) => any, createSendSesEmail: any, createAWSStorageClient: Client, config: Config, createSendEmail: (params) => {} }) => async input => {
  const log = createLogger('uploadToDynamo')
  const data = JSON.parse(input)
  console.log(data?.Records[0]?.s3)
  const key = data?.Records[0]?.s3?.object?.key
  const dynamoTableName: string = config?.dynamodb?.table
  log('Running pipeline')
  try {
    const response = await getFromS3(key)
    const data = response.Body.toString('utf-8')
    const email = response.Metadata.notification
    const payload = JSON.parse(data)
    const storageClient: Client = createAWSStorageClient
    const date: string = new Date().toUTCString()
    const putDeviceToDynamo = createPutDeviceToDynamo({ client: storageClient, tableName: dynamoTableName })
    const results = await putDeviceToDynamo(payload)
  
    const message = generateMessage({ failed: Number(results.failed.length), passed: Number(results.completed.length), total: Number(results.total), time: date })
    await createSendSesEmail({ToAddresses: [email], Data: message, Subject: 'Upload Summary'})
    return
  } catch (e) {
    console.error(e)
  }
}
