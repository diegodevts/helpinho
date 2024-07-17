import { UserDto } from './../../../../shared/dtos/user/user.dto'
import { randomUUID } from 'crypto'
import { GenericRepository } from '../generic-repository'
import { dynamoDBClient } from '../../database/dynamo'
import { env } from '../../env'
import { User } from '../../types'
import { AlreadyExists } from '../../errors/already-exists.error'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { sign } from 'jsonwebtoken'

export class DynamoUserRepository
  implements GenericRepository<User, UserDto, Partial<User>>
{
  async create(payload: UserDto): Promise<void> {
    const params = {
      TableName: env.USER_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: payload.email }
      }
    }

    const { Items } = await dynamoDBClient().query(params).promise()

    if (Items?.length == 1) {
      throw new AlreadyExists('User')
    }

    const id = randomUUID()

    await dynamoDBClient()
      .putItem({
        TableName: env.USER_TABLE,
        Item: {
          id: { S: id },
          name: { S: payload.name },
          email: { S: payload.email },
          password: { S: payload.password },
          phone: { S: payload.phone },
          timestamp: { S: new Date().toISOString() }
        }
      })
      .promise()
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: { email: string; name: string } }> {
    const params = {
      TableName: env.USER_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email }
      }
    }

    const { Items } = await dynamoDBClient().query(params).promise()
    if (Items?.length == 0) {
      throw new ResourceNotFoundError()
    }

    if (Items && Items[0].password.S == password) {
      const secret = env.SECRET as string

      // const passwordMatches = await compare(password, hasUser.password)

      // if (!passwordMatches) {
      //   throw new IncorrectCredentialsError()
      // }

      const token = sign({ id: Items[0].id.S }, secret, {
        expiresIn: '1h'
      })
      return {
        token,
        user: {
          email: Items[0].email?.S as string,
          name: Items[0].name?.S as string
        }
      }
    }
    return {
      token: '',
      user: {
        email: '',
        name: ''
      }
    }
  }

  async findBy(field: string, data: string): Promise<User> {
    const params = {
      TableName: env.USER_TABLE,
      Key: {
        [field]: { S: data }
      }
    }
    const user = await dynamoDBClient().getItem(params).promise()

    if (!user.Item) {
      throw new ResourceNotFoundError()
    }
    const formattedUser: User = {
      id: user.Item.id.S as string,
      name: user.Item.name.S as string,
      email: user.Item.email.S as string,
      password: user.Item.password.S as string,
      phone: user.Item.phone.S as string,
      timestamp: user.Item.timestamp.S as string
    }
    return formattedUser
  }

  async update(data: Partial<User>, id: string): Promise<User> {
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
      TableName: env.USER_TABLE,
      Key: { id: { S: id } },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }

    await dynamoDBClient().updateItem(params).promise()
    const { Item } = await dynamoDBClient()
      .getItem({
        TableName: env.USER_TABLE,
        Key: {
          id: { S: id }
        }
      })
      .promise()

    const formattedUser: User = {
      id: Item!.id.S as string,
      name: Item!.name.S as string,
      email: Item!.email.S as string,
      password: Item!.password.S as string,
      phone: Item!.phone.S as string,
      timestamp: Item!.timestamp.S as string
    }

    return formattedUser
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: env.USER_TABLE,
      Key: {
        id: { S: id }
      }
    }

    await dynamoDBClient().deleteItem(params).promise()
  }
}
