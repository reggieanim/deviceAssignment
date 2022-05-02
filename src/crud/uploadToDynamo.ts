import { compose, head, path, prop } from 'rambda'
import createLogger from '../dependency/util/logger'

const getS3Payload = (data): unknown => compose(prop('s3'), head, path(['body', 'Records']))(data)
const getS3Key = (data): unknown => compose(path(['object', 'key']))(data)

export default ({ getFromS3 }) => async input => {
  const log = createLogger('uploadToDynamo')
  const key = compose(getS3Key, getS3Payload)(input)
  log('Running pipeline')
  try {
    const response = await getFromS3(key)
    const rawData = response.Body.toString('utf-8')
    const payload = JSON.parse(rawData)
    console.log(payload)
    return
  } catch (e) {
    console.error(e)
  }
}
