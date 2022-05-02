
import { type SNS } from 'aws-sdk'
import createLogger from '../dependency/util/logger'

export const createSendEmail = ({ snsClient }: { snsClient: SNS }) => async (params: SNS.Types.PublishInput): Promise<SNS.PublishResponse> => {
    const log = createLogger('SNS:sendemail')
    log('Sending Email with SNS with ', params)
    return snsClient.publish(params).promise()
  }

  export const createSubscriber = ({ snsClient }: { snsClient: SNS }) => async (params: SNS.Types.SubscribeInput): Promise<SNS.SubscribeResponse> => {
    const log = createLogger('SNS:sendemail')
    log('Sending Email with SNS with ', params)
    return snsClient.subscribe(params).promise()
  }
