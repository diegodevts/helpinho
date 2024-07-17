import { Request, Response } from 'express'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateUserUseCase } from '../../usecases/user/create-user.usecase'
import { FindUserUseCase } from '../../usecases/user/find-user.usecase'
import { UpdateUserUseCase } from '../../usecases/user/update-user.usecase'
import { DeleteUserUseCase } from '../../usecases/user/delete-user.usecase'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoUserRepository } from '../../repositories/dynamo/user'
import { AlreadyExists } from '../../errors/already-exists.error'
import { LoginUserUseCase } from '../../usecases/user/login-user.usecase'
import verifyToken from '../../providers/verify-token'

export class UsersController {
  /* Sem injeção de dependÊncia por falta de compatibilidade com o serverless. */

  constructor() {}

  async create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoUserRepository()
    const createUserUseCase = new CreateUserUseCase(repository)

    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      phone: z.string()
    })

    const { name, email, password, phone } = registerBodySchema.parse(
      JSON.parse(event.body as string)
    )

    try {
      await createUserUseCase.handle({
        name,
        email,
        password,
        phone
      })

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Succesfuly created!', code: 201 })
      }
    } catch (err: any) {
      if (err instanceof AlreadyExists) {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: err.message, code: 409 })
        }
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', code: 500 })
      }
    }
  }

  async login(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoUserRepository()
    const loginUserUseCase = new LoginUserUseCase(repository)
    const registerBodySchema = z.object({
      email: z.string(),
      password: z.string()
    })

    const { email, password } = registerBodySchema.parse(
      JSON.parse(event.body as string)
    )

    try {
      const { token, user } = await loginUserUseCase.handle(email, password)

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Succesfuly logged!',
          code: 201,
          token,
          user
        })
      }
    } catch (err: any) {
      if (err instanceof ResourceNotFoundError) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: err.message, code: 404 })
        }
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', code: 500 })
      }
    }
  }

  async find(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoUserRepository()
    const findUserUseCase = new FindUserUseCase(repository)
    verifyToken(event)
    const registerParamsSchema = z.object({ id: z.string() })

    const { id } = registerParamsSchema.parse(event.pathParameters)

    try {
      const user = await findUserUseCase.handle(id)

      return {
        statusCode: 200,
        body: JSON.stringify({ user, code: 200 })
      }
    } catch (err: any) {
      if (err instanceof ResourceNotFoundError) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: err.message, code: 404 })
        }
      }

      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', code: 500 })
      }
    }
  }

  async update(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoUserRepository()
    const updateUserUseCase = new UpdateUserUseCase(repository)
    verifyToken(event)
    const registerBodySchema = z.object({
      name: z.optional(z.string()),
      email: z.optional(z.string()),
      password: z.optional(z.string()),
      phone: z.optional(z.string())
    })
    const registerParamsSchema = z.object({ id: z.string() })

    const data = registerBodySchema.parse(JSON.parse(event.body as string))

    const { id } = registerParamsSchema.parse(event.pathParameters)

    try {
      const user = await updateUserUseCase.handle(data, id)

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Succesfuly updated!',
          code: 201,
          user
        })
      }
    } catch (err: any) {
      if (err instanceof ResourceNotFoundError) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: err.message, code: 404 })
        }
      }

      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', code: 500 })
      }
    }
  }

  async _delete(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(repository)
    verifyToken(event)
    const registerParamsSchema = z.object({ id: z.string() })

    const { id } = registerParamsSchema.parse(event.pathParameters)

    try {
      await deleteUserUseCase.handle(id)

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Successfuly deleted!', code: 200 })
      }
    } catch (err: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', code: 500 })
      }
    }
  }
}
