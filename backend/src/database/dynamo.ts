import * as AWS from 'aws-sdk'
import { DynamoDB } from 'aws-sdk'
import 'dotenv/config'

const { ENDPOINT_URL, REGION, AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID } =
  process.env

export const dynamoDBClient = (): DynamoDB => {
  return new AWS.DynamoDB({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: REGION,
    endpoint: ENDPOINT_URL
  })
}
