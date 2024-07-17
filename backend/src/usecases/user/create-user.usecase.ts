import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { User } from '../../types'
import { UserDto } from '../../../../shared/dtos/user/user.dto'

export class CreateUserUseCase implements GenericUseCase<User> {
  constructor(
    private genericRepository: GenericRepository<User, UserDto, Partial<User>>
  ) {}

  async handle(data: UserDto): Promise<void> {
    await this.genericRepository.create(data)
  }
}
