import { DynamoDB } from 'aws-sdk'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { Helper, User } from '../../types'
import { HelperDto } from '../../../../shared/dtos/helper/helper.dto'

export interface HandlerParams {
  take: number
  lastEvaluatedKey?: DynamoDB.Key | null
}

export class FindHelpersUseCase implements GenericUseCase<Helper[]> {
  constructor(
    private genericRepository: GenericRepository<
      Helper,
      HelperDto,
      Partial<Helper>
    >
  ) {}

  async handle({
    take,
    lastEvaluatedKey = null
  }: HandlerParams): Promise<Helper[]> {
    return await this.genericRepository.findAll!(
      take,
      lastEvaluatedKey || undefined
    )
  }
}
