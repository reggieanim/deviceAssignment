import { type AwilixContainer } from 'awilix'
import { formatJSONResponse } from '@libs/api-gateway';
import createDepContainer from '../../dependency'
import { middyfy } from '@libs/lambda';

const processDevice = async (event) => {
  const depContainer: AwilixContainer<any> = createDepContainer()
  const uploadToDynamo = depContainer.resolve('uploadToDynamo')
  console.log(event)
  await uploadToDynamo(event.Records[0].body)
  return formatJSONResponse({
    message: "Files Processed Successfully",
  });
};

export const main = middyfy(processDevice);
