import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

type ExistingOrLookupUser = {
  id: number;
  email?: string;
};

type UserSummary = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

const mockFindUnique =
  jest.fn<
    (args: {
      where: { email?: string; id?: number };
      select?: { id: true };
    }) => Promise<ExistingOrLookupUser | null>
  >();

const mockFindMany =
  jest.fn<
    (args: {
      orderBy: { id: 'asc' };
      select: { id: true; name: true; email: true; createdAt: true };
    }) => Promise<UserSummary[]>
  >();

const mockCreate =
  jest.fn<
    (args: {
      data: { name: string; email: string; password: string };
      select: { id: true; name: true; email: true; createdAt: true };
    }) => Promise<UserSummary>
  >();

const mockUpdate =
  jest.fn<
    (args: {
      where: { id: number };
      data: { name: string; email: string };
      select: { id: true; name: true; email: true; createdAt: true };
    }) => Promise<UserSummary>
  >();

const mockDelete =
  jest.fn<
    (args: {
      where: { id: number };
      select: { id: true; name: true; email: true; createdAt: true };
    }) => Promise<UserSummary>
  >();

const mockPrismaService = {
  user: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should return all users ordered by id', async () => {
    const users: UserSummary[] = [
      {
        id: 1,
        name: 'alice',
        email: 'alice@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
      {
        id: 2,
        name: 'bob',
        email: 'bob@example.com',
        createdAt: new Date('2026-03-24T00:00:00.000Z'),
      },
    ];
    mockFindMany.mockResolvedValue(users);

    const result = await service.findAll();

    expect(result).toEqual(users);
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  });

  it('should create user with normalized email and default password', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      createdAt: new Date('2026-03-24T00:00:00.000Z'),
    });

    const result = await service.createUser('John');

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'john@example.com' },
    });

    const createArgs = mockCreate.mock.calls[0]?.[0];
    expect(createArgs).toBeDefined();
    if (!createArgs) {
      throw new Error('Expected create call arguments');
    }

    expect(createArgs.data.name).toBe('John');
    expect(createArgs.data.email).toBe('john@example.com');
    const isPasswordHashed = await bcrypt.compare(
      'password123',
      createArgs.data.password,
    );
    expect(isPasswordHashed).toBe(true);

    expect(result.user).toEqual({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      createdAt: new Date('2026-03-24T00:00:00.000Z'),
    });
  });

  it('should throw ConflictException when generated email already exists', async () => {
    mockFindUnique.mockResolvedValue({
      id: 99,
      email: 'john@example.com',
    });

    await expect(service.createUser('John')).rejects.toThrow(ConflictException);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should generate dot-separated email when username contains spaces', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 1,
      name: 'vipin doe',
      email: 'vipin.doe@example.com',
      createdAt: new Date('2026-03-24T00:00:00.000Z'),
    });

    const result = await service.createUser('vipin doe');

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'vipin.doe@example.com' },
    });
    expect(result.user.email).toBe('vipin.doe@example.com');
  });

  it('should throw BadRequestException for invalid username', async () => {
    await expect(service.createUser('   @@@   ')).rejects.toThrow(
      BadRequestException,
    );
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should update user when id exists and generated email is available', async () => {
    const updatedAt = new Date('2026-03-24T00:00:00.000Z');
    mockFindUnique.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce(null);
    mockUpdate.mockResolvedValue({
      id: 1,
      name: 'john.updated',
      email: 'john.updated@example.com',
      createdAt: updatedAt,
    });

    const result = await service.updateUser(1, 'john.updated');

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'john.updated',
        email: 'john.updated@example.com',
      },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    expect(result).toEqual({
      user: {
        id: 1,
        name: 'john.updated',
        email: 'john.updated@example.com',
        createdAt: updatedAt,
      },
    });
  });

  it('should update user with dot-separated email when username contains spaces', async () => {
    const updatedAt = new Date('2026-03-24T00:00:00.000Z');
    mockFindUnique.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce(null);
    mockUpdate.mockResolvedValue({
      id: 1,
      name: 'vipin doe',
      email: 'vipin.doe@example.com',
      createdAt: updatedAt,
    });

    const result = await service.updateUser(1, 'vipin doe');

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'vipin doe',
        email: 'vipin.doe@example.com',
      },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    expect(result.user.email).toBe('vipin.doe@example.com');
  });

  it('should throw NotFoundException when updating missing user', async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    await expect(service.updateUser(404, 'john')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when updating to existing email', async () => {
    mockFindUnique
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2, email: 'john@example.com' });

    await expect(service.updateUser(1, 'john')).rejects.toThrow(
      ConflictException,
    );
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should remove user when id exists', async () => {
    const createdAt = new Date('2026-03-24T00:00:00.000Z');
    mockFindUnique.mockResolvedValueOnce({ id: 1 });
    mockDelete.mockResolvedValue({
      id: 1,
      name: 'john',
      email: 'john@example.com',
      createdAt,
    });

    const result = await service.removeUser(1);

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    expect(result).toEqual({
      message: 'User deleted successfully',
      user: {
        id: 1,
        name: 'john',
        email: 'john@example.com',
        createdAt,
      },
    });
  });

  it('should throw NotFoundException when deleting missing user', async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    await expect(service.removeUser(404)).rejects.toThrow(NotFoundException);
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
