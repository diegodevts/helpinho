import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { User } from '../../types'
import { UserDto } from '../../../../shared/dtos/user/user.dto'

export class FindUserUseCase implements GenericUseCase<User> {
  constructor(
    private genericRepository: GenericRepository<User, UserDto, Partial<User>>
  ) {}

  async handle(id: string): Promise<User> {
    const user = await this.genericRepository.findBy!('id', id)

    return user as User
  }
}
