import { APIGatewayProxyEvent } from 'aws-lambda'
import { UnauthorizedError } from '../errors/unauthorized.error'
import { verify } from 'jsonwebtoken'
import { Token } from '../types'
import 'dotenv/config'

export default function verifyToken(req: APIGatewayProxyEvent) {
  const { authorization } = req.headers

  if (!authorization) {
    throw new UnauthorizedError('Token inválido.')
  }

  const [_, token] = authorization.split(' ')

  const secret = process.env.SECRET as string
  const decriptedToken = verify(token, secret)
  const { id } = decriptedToken as Token

  return { userId: id }
}
