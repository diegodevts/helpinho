import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { Helper } from '../../types'
import { HelperDto } from '../../../../shared/dtos/helper/helper.dto'

export class DonateHelperUseCase implements GenericUseCase<Helper> {
  constructor(
    private genericRepository: GenericRepository<
      Helper,
      HelperDto,
      Partial<Helper>
    >
  ) {}

  async handle(value: string, id: string): Promise<void> {
    await this.genericRepository.donate!({ value: +value, id })
  }
}
