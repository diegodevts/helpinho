import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { Helper, User } from '../../types'
import { HelperDto } from '../../../../shared/dtos/helper/helper.dto'
export class FindHelperUseCase implements GenericUseCase<Helper> {
  constructor(
    private genericRepository: GenericRepository<
      Helper,
      HelperDto,
      Partial<Helper>
    >
  ) {}

  async handle(id: string): Promise<Helper> {
    const helper = await this.genericRepository.findBy!('id', id)

    return helper as Helper
  }
}
