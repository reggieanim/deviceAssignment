# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Environment Variables

- Create an env.local file
- These envs are need for testing
```
env="dev"
DEBUG="*,
S3_AUTH_ACCESS_KEY_ID="EXAMPLE"
S3_AUTH_SECRET_ACCESS_KEY="EXAMPLE"
S3_AUTH_REGION="EXAMPLE"
S3_BUCKET_NAME="device-data-assignmentv477"
VERSION="1.0.0"

DYNAMODB_AUTH_ACCESS_KEY_ID="EXAMPLE"
DYNAMODB_AUTH_SECRET_ACCESS_KEY="EXAMPLE"
DYNAMODB_AUTH_REGION="us-east-1"
DYNAMODB_AUTH_TABLE="devicesTable277"

SNS_AUTH_ACCESS_KEY_ID="EXAMPLE4"
SNS_AUTH_SECRET_ACCESS_KEY="EXAMPLE"
SNS_AUTH_REGION="us-east-1"
SNS_TOPIC="sendPEmail"
SNS_TOPIC_ARN="EXAMPLE"
```

## Test your service



### Locally

In order to test the hello function locally, run the following command:

- `npx sls offline` if you're using NPM
- `yarn sls offline` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```
### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
