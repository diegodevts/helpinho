import { randomUUID } from 'crypto'
import { GenericRepository } from '../generic-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { ScanInput } from 'aws-sdk/clients/dynamodb'

export const id = randomUUID()

export class InMemoryGenericRepository<T extends C, C, U>
  implements GenericRepository<T, C, U>
{
  public items: T[] = []

  async create(data: C): Promise<void> {
    this.items.push({ ...data, timestamp: Date.now(), id } as T)
  }

  async findBy(field: string, data: string): Promise<T | null> {
    const item = this.items.find((item) => item[field] === data)

    if (!item) {
      throw new ResourceNotFoundError()
    }
    return item
  }

  async findAll(take: number): Promise<T[]> {
    return this.items.slice(0, take)
  }

  async update(data: U, id: string): Promise<T | null> {
    const data_to_update = this.items.find((data) => data['id'] === id)
    if (data_to_update) {
      Object.assign(data_to_update, data)
    }

    return data_to_update ?? null
  }

  async donate({ id, value }: { value: number; id: string }): Promise<T | any> {
    const user = this.items.find((item) => item['userId'] === id) as any

    user.value = value

    return user
  }

  async delete(id: string): Promise<void> {
    const data = this.items.find((item) => item['id'] === id)
    const itemIndex = this.items.indexOf(data as T)

    this.items.splice(itemIndex, 1)
  }
}
