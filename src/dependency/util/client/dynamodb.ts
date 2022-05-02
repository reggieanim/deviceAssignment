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
      auth: { accessKeyId, secretAccessKey, region },
    },
  },
}: { config: Config }): DynamoDB.DocumentClient =>
  new DynamoDB.DocumentClient({
    accessKeyId,
    secretAccessKey,
    region,
  });
