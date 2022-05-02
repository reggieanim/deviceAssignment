import { type DynamoDB } from "aws-sdk"



const createPutAction = ({
    dynamoDocumentClient
}: { dynamoDocumentClient: DynamoDB.DocumentClient }) => async (tableName: string, data) => {
    await dynamoDocumentClient
        .put({
            ReturnConsumedCapacity: 'TOTAL',
            TableName: tableName,
            Item: data
        })
        .promise()
    return data
}

export const createAWSStorageClient = ({
    dynamoDocumentClient
}) => ({ put: createPutAction({ dynamoDocumentClient }) })
