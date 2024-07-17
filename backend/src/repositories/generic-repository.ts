import { DynamoDB } from 'aws-sdk'
export interface GenericRepository<T, C, U> {
  findBy?(field: string, data: string): Promise<T | null>
  login?(
    email: string,
    password: string
  ): Promise<{ token: string; user: { email: string; name: string } }>
  findAll?(limit: number, lastEvaluatedKey?: DynamoDB.Key): Promise<T[]>
  create(data: C): Promise<void>
  update(data: U, id: string): Promise<T | null>
  delete(id: string): Promise<void>
  donate?({ id, value }: { value: number; id: string }): Promise<T | any>
}
