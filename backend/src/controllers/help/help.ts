import { z } from 'zod'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateHelperUseCase } from '../../usecases/helper/create-helper.usecase'
import { DynamoHelperRepository } from '../../repositories/dynamo/help'
import { FindHelperUseCase } from '../../usecases/helper/find-helper.usecase'
import { UpdateHelperUseCase } from '../../usecases/helper/update-helper.usecase'
import { DeleteHelperUseCase } from '../../usecases/helper/delete-helper.usecase'
import { DonateHelperUseCase } from '../../usecases/helper/donate-helper.usecase'
import { FindHelpersUseCase } from '../../usecases/helper/find-helpers.usecase'
import { env } from '../../env'
import * as jwt from 'jsonwebtoken'
import { Token } from '../../types'
import { UnauthorizedError } from '../../errors/unauthorized.error'
import verifyToken from '../../providers/verify-token'

export class HelpersController {
  /* Sem injeção de dependÊncia por falta de compatibilidade com o serverless. */

  constructor() {}

  async create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoHelperRepository()
    const createHelperUseCase = new CreateHelperUseCase(repository)
    const { userId } = verifyToken(event)

    const registerBodySchema = z.object({
      user: z.object({ name: z.string(), email: z.string() }),
      image: z.string(),
      goal: z.string(),
      value: z.string(),
      description: z.string(),
      title: z.string(),
      category: z.string()
    })

    const { description, goal, image, title, value, category, user } =
      registerBodySchema.parse(JSON.parse(event.body as string))

    try {
      await createHelperUseCase.handle({
        description,
        goal,
        image,
        userId: userId as string,
        title,
        value,
        category,
        user
      })

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Succesfuly created!', code: 201 })
      }
    } catch (err: any) {
      console.log(err)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', code: 500 })
      }
    }
  }

  async donate(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoHelperRepository()
    const donateHelperUseCase = new DonateHelperUseCase(repository)
    verifyToken(event)

    const registerBodySchema = z.object({
      value: z.string(),
      id: z.string()
    })

    const { value, id } = registerBodySchema.parse(
      JSON.parse(event.body as string)
    )

    try {
      await donateHelperUseCase.handle(value, id)

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Succesfuly donated!', code: 201 })
      }
    } catch (err: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error', code: 500 })
      }
    }
  }

  async find(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoHelperRepository()
    const findHelperUseCase = new FindHelperUseCase(repository)
    const registerParamsSchema = z.object({ id: z.string() })
    verifyToken(event)

    const { id } = registerParamsSchema.parse(event.pathParameters)

    try {
      const helper = await findHelperUseCase.handle(id)

      return {
        statusCode: 200,
        body: JSON.stringify({ helper, code: 200 })
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

  async findAll(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const repository = new DynamoHelperRepository()
    const findHelperUseCase = new FindHelpersUseCase(repository)
    verifyToken(event)
    const registerQuerySchema = z.object({ take: z.optional(z.string()) })

    const { take } = registerQuerySchema.parse(
      event.queryStringParameters ?? { take: '10' }
    )

    try {
      const helpers = await findHelperUseCase.handle({
        take: take ? +take : 10
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ helpers, code: 200 })
      }
    } catch (err: any) {
      console.log(err)
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
    const repository = new DynamoHelperRepository()
    const updateHelperUseCase = new UpdateHelperUseCase(repository)
    verifyToken(event)
    const registerBodySchema = z.object({
      image: z.optional(z.string()),
      goal: z.optional(z.string()),
      description: z.optional(z.string()),
      title: z.optional(z.string()),
      userId: z.optional(z.string())
    })
    const registerParamsSchema = z.object({ id: z.string() })

    const data = registerBodySchema.parse(JSON.parse(event.body as string))

    const { id } = registerParamsSchema.parse(event.pathParameters)

    try {
      const helper = await updateHelperUseCase.handle(data, id)

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Succesfuly updated!',
          code: 201,
          helper
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
    const repository = new DynamoHelperRepository()
    const deleteHelperUseCase = new DeleteHelperUseCase(repository)
    verifyToken(event)
    const registerParamsSchema = z.object({ id: z.string() })

    const { id } = registerParamsSchema.parse(event.pathParameters)

    try {
      await deleteHelperUseCase.handle(id)

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
