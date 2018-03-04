import AWS from 'aws-sdk'

export let DynamoDB

export const setAwsConfig = ({
  accessKeyId,
  secretAccessKey,
  region,
  endpoint
} = {}) => {
  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region,
    endpoint: endpoint || `https://dynamodb.${region}.amazonaws.com`
  })

  DynamoDB = new AWS.DynamoDB()

  return AWS
}
