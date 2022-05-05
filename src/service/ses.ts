export const createSendEmail = ({ sesClient }) => async ({ToAddresses, Data, Subject }: { ToAddresses: string[], Data: string, Subject: string}) => {
  try {
    const sesParams = {
      Destination: {
        ToAddresses
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: Subject
        }
      },
      Source: 'animreggie@gmail.com',
    }

    const response = await sesClient.sendEmail(sesParams).promise()
    return response
  } catch (error) {
    console.log(error)
  }
}
