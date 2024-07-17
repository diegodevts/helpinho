import { randomUUID } from 'crypto'
import { expect, describe, it, beforeEach } from 'vitest'
import {
  InMemoryGenericRepository,
  id
} from '../../repositories/in-memory/generic-in-memory-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { Helper } from '../../types'
import { FindHelperUseCase } from './find-helper.usecase'
import { CreateHelperUseCase } from './create-helper.usecase'
import { UpdateHelperUseCase } from './update-helper.usecase'
import { DeleteHelperUseCase } from './delete-helper.usecase'
import { HelperDto } from '../../../../shared/dtos/helper/helper.dto'
import { FindHelpersUseCase } from './find-helpers.usecase'
import { DonateHelperUseCase } from './donate-helper.usecase'

let helpersRepository: InMemoryGenericRepository<
  Helper,
  HelperDto,
  Partial<Helper>
>
let createUseCase: CreateHelperUseCase
let findUseCase: FindHelperUseCase
let findAllUseCase: FindHelpersUseCase
let updateUseCase: UpdateHelperUseCase
let donateUseCase: DonateHelperUseCase
let deleteUseCase: DeleteHelperUseCase

const userId = randomUUID()

describe('Helper Usecase', () => {
  beforeEach(async () => {
    helpersRepository = new InMemoryGenericRepository()
    createUseCase = new CreateHelperUseCase(helpersRepository)
    findUseCase = new FindHelperUseCase(helpersRepository)
    findAllUseCase = new FindHelpersUseCase(helpersRepository)
    updateUseCase = new UpdateHelperUseCase(helpersRepository)
    deleteUseCase = new DeleteHelperUseCase(helpersRepository)
    donateUseCase = new DonateHelperUseCase(helpersRepository)

    await createUseCase.handle({
      image: 'image_url',
      value: '1000',
      goal: '0',
      description: 'test',
      title: 'test2',
      userId,
      category: 'music',
      user: {
        name: 'Diego',
        email: 'diego@htmail.com'
      }
    })
  })

  it('should be able to create a helper', async () => {
    expect(helpersRepository.items.length).toEqual(1)
  })

  it('should be able to get a helper by id', async () => {
    const helper = await findUseCase.handle(id)

    expect(helper.id).toEqual(id)
    expect(helper.value).toBe('1000')
  })

  it('should be able to update a helper by id', async () => {
    const helper = await updateUseCase.handle({ goal: '2000' }, id)

    expect(helper.id).toEqual(id)
    expect(helper.goal).toBe('2000')
  })

  it('should be able find all helpers', async () => {
    const helpers = await findAllUseCase.handle({ take: 10 })

    expect(helpers.length > 0).toBeTruthy()
    expect(Array.isArray(helpers)).toBeTruthy()
  })

  it('should be able to donate to some user', async () => {
    const helpers = await helpersRepository.donate({ value: 100, id: userId })

    expect(helpers.value == 100).toBeTruthy()
    expect(helpers.value == helpersRepository.items[0].value).toBeTruthy()
  })

  it('should be able to delete a helper by id', async () => {
    await deleteUseCase.handle(id)

    expect(helpersRepository.items.length).toEqual(0)
  })

  it('should not be able to get or update a helper by wrong id', async () => {
    await expect(
      async () => await findUseCase.handle('non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(
      async () =>
        await updateUseCase.handle({ description: 'ZZZZ' }, 'non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
