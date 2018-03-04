import AWS from 'aws-sdk'

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

  return AWS
}

export default AWS
