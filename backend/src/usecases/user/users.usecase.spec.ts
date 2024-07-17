import { expect, describe, it, beforeEach } from 'vitest'
import {
  InMemoryGenericRepository,
  id
} from '../../repositories/in-memory/generic-in-memory-repository'
import { randomUUID } from 'crypto'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { User } from '../../types'
import { CreateUserUseCase } from './create-user.usecase'
import { FindUserUseCase } from './find-user.usecase'
import { UpdateUserUseCase } from './update-user.usecase'
import { DeleteUserUseCase } from './delete-user.usecase'
import { UserDto } from '../../../../shared/dtos/user/user.dto'

let usersRepository: InMemoryGenericRepository<User, UserDto, Partial<User>>
let createUseCase: CreateUserUseCase
let findUseCase: FindUserUseCase
let updateUseCase: UpdateUserUseCase
let deleteUseCase: DeleteUserUseCase

describe('User Usecase', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryGenericRepository()
    createUseCase = new CreateUserUseCase(usersRepository)
    findUseCase = new FindUserUseCase(usersRepository)
    updateUseCase = new UpdateUserUseCase(usersRepository)
    deleteUseCase = new DeleteUserUseCase(usersRepository)

    await createUseCase.handle({
      name: 'Diego',
      email: 'diego@hotmail.com',
      password: '123456',
      phone: '12345678'
    })
  })

  it('should be able to create a user', async () => {
    expect(usersRepository.items.length).toEqual(1)
  })

  it('should be able to get a user by id', async () => {
    const user = await findUseCase.handle(id)

    expect(user.id).toEqual(id)
    expect(user.name).toBe('Diego')
  })

  it('should be able to update a user by id', async () => {
    const user = await updateUseCase.handle({ name: 'Diego Lima' }, id)

    expect(user.id).toEqual(id)
    expect(user.name).toBe('Diego Lima')
  })

  it('should be able to delete a user by id', async () => {
    await deleteUseCase.handle(id)

    expect(usersRepository.items.length).toEqual(0)
  })

  it('should not be able to get or update a user by wrong id', async () => {
    await expect(
      async () => await findUseCase.handle('non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(
      async () =>
        await updateUseCase.handle({ name: 'ZZZZ' }, 'non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
