import { type DynamoDB } from "aws-sdk"

const createPutAction = ({
    dynamoDocumentClient
}: { dynamoDocumentClient: DynamoDB.DocumentClient }) => async (tableName: string, data: any) => {
    await dynamoDocumentClient
        .put({
            ReturnConsumedCapacity: 'TOTAL',
            TableName: tableName,
            Item: data,
            ConditionExpression: "#deviceId <> :deviceId",
            ExpressionAttributeNames: {
                "#deviceId": "deviceId",
            },
            ExpressionAttributeValues: {
                ":deviceId": data.deviceId,
            },
        })
        .promise()
    return data
}

export const createAWSStorageClient = ({
    dynamoDocumentClient
}: {dynamoDocumentClient:DynamoDB.DocumentClient}) => ({ put: createPutAction({ dynamoDocumentClient }) })
