import { HelperDto } from './../../../../shared/dtos/helper/helper.dto'
import { randomUUID } from 'crypto'
import { GenericRepository } from '../generic-repository'
import { DynamoDB } from 'aws-sdk'
import { dynamoDBClient } from '../../database/dynamo'
import { env } from '../../env'
import { Helper } from '../../types'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'

export class DynamoHelperRepository
  implements GenericRepository<Helper, HelperDto, Partial<Helper>>
{
  async create(payload: HelperDto): Promise<void> {
    const id = randomUUID()

    await dynamoDBClient()
      .putItem({
        TableName: env.HELPER_TABLE,
        Item: {
          id: { S: id },
          image: { S: payload.image },
          category: { S: payload.category },
          goal: { N: payload.goal },
          value: { N: payload.value },
          user: {
            M: {
              name: { S: payload.user.name },
              email: { S: payload.user.email }
            }
          },
          description: { S: payload.description },
          title: { S: payload.title },
          userId: { S: payload.userId },
          timestamp: { S: new Date().toISOString() }
        }
      })
      .promise()
  }

  async findBy(field: string, data: string): Promise<Helper> {
    const params = {
      TableName: env.HELPER_TABLE,
      Key: {
        [field]: { S: data }
      }
    }
    const helper = await dynamoDBClient().getItem(params).promise()

    if (!helper.Item) {
      throw new ResourceNotFoundError()
    }

    const formattedHelper: Helper = {
      description: helper.Item.description.S as string,
      goal: helper.Item.goal.N as string,
      id: helper.Item.id.S as string,
      user: {
        name: helper.Item?.user.M?.name.S as string,
        email: helper.Item?.user?.M?.email.S as string
      },
      image: helper.Item.image.S as string,
      timestamp: helper.Item.timestamp.S as string,
      title: helper.Item.title.S as string,
      userId: helper.Item.userId.S as string,
      value: helper.Item.value.N as string,
      category: helper.Item.category.S as string
    }

    return formattedHelper
  }

  async donate({ id, value }: { value: number; id: string }): Promise<Helper> {
    const params = {
      TableName: env.HELPER_TABLE,
      Key: { id: { S: id } },
      UpdateExpression: 'SET goal = if_not_exists(goal, :initial) + :num',
      ExpressionAttributeValues: {
        ':num': { N: value.toString() },
        ':initial': { N: '0' }
      },
      ReturnValues: 'ALL_NEW'
    }

    await dynamoDBClient().updateItem(params).promise()

    const { Item } = await dynamoDBClient()
      .getItem({
        TableName: env.HELPER_TABLE,
        Key: {
          id: { S: id }
        }
      })
      .promise()

    const formattedHelper: Helper = {
      description: Item?.description.S as string,
      goal: Item?.goal.N as string,
      id: Item?.id.S as string,
      user: {
        name: Item?.user.M?.name.S as string,
        email: Item?.user?.M?.email.S as string
      },
      image: Item?.image.S as string,
      timestamp: Item?.timestamp.S as string,
      title: Item?.title.S as string,
      userId: Item?.userId.S as string,
      value: Item?.value.N as string,
      category: Item?.category.S as string
    }

    return formattedHelper
  }

  async findAll(
    limit: number,
    lastEvaluatedKey?: DynamoDB.Key
  ): Promise<Helper[]> {
    const params: DynamoDB.ScanInput = {
      TableName: env.HELPER_TABLE,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey
    }

    const result = await dynamoDBClient().scan(params).promise()

    const helpers: Helper[] =
      result.Items?.map((item) => ({
        id: item.id.S as string,
        userId: item.userId.S as string,
        goal: item.goal.N as string,
        user: {
          name: item.user.M?.name.S as string,
          email: item.user.M?.email.S as string
        },
        value: item.value.N as string,
        image: item.image.S as string,
        description: item.description.S as string,
        category: item.category.S as string,
        title: item.title.S as string,
        timestamp: item.timestamp.S as string
      })) || []

    return helpers
  }

  async update(data: Partial<Helper>, id: string): Promise<Helper> {
    const updateExpression: string[] = []
    const expressionAttributeNames = {}
    const expressionAttributeValues = {}

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
          updateExpression.push(`#${key} = :${key}`)
          expressionAttributeNames[`#${key}`] = key
          expressionAttributeValues[`:${key}`] = { S: data[key] }
        }
      }
    }

    if (updateExpression.length === 0) {
      throw new Error('No valid attributes provided for update')
    }

    const params = {
      TableName: env.HELPER_TABLE,
      Key: { id: { S: id } },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }

    await dynamoDBClient().updateItem(params).promise()
    const { Item } = await dynamoDBClient()
      .getItem({
        TableName: env.HELPER_TABLE,
        Key: {
          id: { S: id }
        }
      })
      .promise()

    const formattedHelper: Helper = {
      description: Item?.description.S as string,
      goal: Item?.goal.N as string,
      id: Item?.id.S as string,
      user: {
        name: Item?.user.M?.name.S as string,
        email: Item?.user?.M?.email.S as string
      },
      image: Item?.image.S as string,
      timestamp: Item?.timestamp.S as string,
      title: Item?.title.S as string,
      userId: Item?.userId.S as string,
      value: Item?.value.N as string,
      category: Item?.category.S as string
    }

    return formattedHelper
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: env.HELPER_TABLE,
      Key: {
        id: { S: id }
      }
    }

    await dynamoDBClient().deleteItem(params).promise()
  }
}
