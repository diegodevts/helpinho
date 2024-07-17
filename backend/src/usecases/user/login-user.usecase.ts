import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { User } from '../../types'
import { UserDto } from '../../../../shared/dtos/user/user.dto'

export class LoginUserUseCase implements GenericUseCase<{ token: string }> {
  constructor(
    private genericRepository: GenericRepository<User, UserDto, Partial<User>>
  ) {}

  async handle(
    email: string,
    password: string
  ): Promise<{ token: string; user: { name: string; email: string } }> {
    const { token, user } = await this.genericRepository.login!(email, password)

    return { token, user }
  }
}
