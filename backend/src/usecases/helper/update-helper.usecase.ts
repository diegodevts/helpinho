import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { Helper } from '../../types'
import { HelperDto } from '../../../../shared/dtos/helper/helper.dto'

export class UpdateHelperUseCase implements GenericUseCase<Helper> {
  constructor(
    private genericRepository: GenericRepository<
      Helper,
      HelperDto,
      Partial<Helper>
    >
  ) {}

  async handle(data: Partial<Helper>, id: string): Promise<Helper> {
    const updatedHelper = await this.genericRepository.update(data, id)

    if (!updatedHelper) {
      throw new ResourceNotFoundError()
    }

    return updatedHelper
  }
}
