import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { User } from '../../types'
import { UserDto } from '../../../../shared/dtos/user/user.dto'

export class UpdateUserUseCase implements GenericUseCase<User> {
  constructor(
    private genericRepository: GenericRepository<User, UserDto, Partial<User>>
  ) {}

  async handle(data: Partial<User>, id: string): Promise<User> {
    const updatedUser = await this.genericRepository.update(data, id)

    if (!updatedUser) {
      throw new ResourceNotFoundError()
    }

    return updatedUser
  }
}
