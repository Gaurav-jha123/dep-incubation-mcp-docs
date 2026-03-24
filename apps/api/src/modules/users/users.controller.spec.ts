import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

type UserSummary = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

const mockFindAll = jest.fn<() => Promise<UserSummary[]>>();
const mockCreateUser =
  jest.fn<(username: string) => Promise<{ user: UserSummary }>>();
const mockUpdateUser =
  jest.fn<(id: number, username: string) => Promise<{ user: UserSummary }>>();
const mockRemoveUser =
  jest.fn<(id: number) => Promise<{ message: string; user: UserSummary }>>();

const mockUsersService = {
  findAll: mockFindAll,
  createUser: mockCreateUser,
  updateUser: mockUpdateUser,
  removeUser: mockRemoveUser,
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should call usersService.findAll', async () => {
    const users: UserSummary[] = [
      {
        id: 1,
        name: 'john',
        email: 'john@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
    ];
    mockFindAll.mockResolvedValue(users);

    const result = await controller.findAll();

    expect(mockFindAll).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('should call usersService.createUser with username', async () => {
    mockCreateUser.mockResolvedValue({
      user: {
        id: 1,
        name: 'john',
        email: 'john@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
    });

    const result = await controller.create({ username: 'john' });

    expect(mockCreateUser).toHaveBeenCalledWith('john');
    expect(result).toEqual({
      user: {
        id: 1,
        name: 'john',
        email: 'john@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
    });
  });

  it('should call usersService.updateUser with id and username', async () => {
    mockUpdateUser.mockResolvedValue({
      user: {
        id: 1,
        name: 'john.updated',
        email: 'john.updated@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
    });

    const result = await controller.update(1, { username: 'john.updated' });

    expect(mockUpdateUser).toHaveBeenCalledWith(1, 'john.updated');
    expect(result).toEqual({
      user: {
        id: 1,
        name: 'john.updated',
        email: 'john.updated@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
    });
  });

  it('should call usersService.removeUser with id', async () => {
    mockRemoveUser.mockResolvedValue({
      message: 'User deleted successfully',
      user: {
        id: 1,
        name: 'john',
        email: 'john@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
    });

    const result = await controller.remove(1);

    expect(mockRemoveUser).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      message: 'User deleted successfully',
      user: {
        id: 1,
        name: 'john',
        email: 'john@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
    });
  });
});
