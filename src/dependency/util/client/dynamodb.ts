import { DynamoDB } from "aws-sdk";
import { type Config } from "../../../config";

export const createDynamoClient = ({
  config: { dynamodb: { auth: { accessKeyId, secretAccessKey, region },
  },
  },
}: { config: Config }) => new DynamoDB({ accessKeyId, secretAccessKey, region });

export const createDynamoDocumentClient = ({
  config: {
    dynamodb: {
      auth: { endpoint, accessKeyId, secretAccessKey, region },
    },
  },
}: { config: Config }) =>
  new DynamoDB.DocumentClient({
    endpoint,
    accessKeyId,
    secretAccessKey,
    region,
  });
