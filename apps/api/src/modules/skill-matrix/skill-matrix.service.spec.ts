import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { SkillMatrixService } from './skill-matrix.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';

const mockPrismaService = {
  skillMatrix: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockEntry = {
  id: 1,
  userId: 10,
  topicId: 3,
  value: 80,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: { id: 10, name: 'Alice', email: 'alice@test.com' },
  topic: { id: 3, label: 'React' },
};

describe('SkillMatrixService', () => {
  let service: SkillMatrixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillMatrixService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SkillMatrixService>(SkillMatrixService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return a flat array when no pagination params are given', async () => {
      mockPrismaService.skillMatrix.findMany.mockResolvedValue([mockEntry]);

      const result = await service.findAll({});

      expect(result).toEqual([mockEntry]);
      expect(mockPrismaService.skillMatrix.count).not.toHaveBeenCalled();
    });

    it('should return paginated envelope when page and limit are given', async () => {
      mockPrismaService.skillMatrix.findMany.mockResolvedValue([mockEntry]);
      mockPrismaService.skillMatrix.count.mockResolvedValue(25);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: [mockEntry],
        meta: { total: 25, page: 1, limit: 10, totalPages: 3 },
      });
    });
  });

  describe('findOne', () => {
    it('should return the record when it exists', async () => {
      mockPrismaService.skillMatrix.findUnique.mockResolvedValue(mockEntry);

      const result = await service.findOne(1);

      expect(result).toEqual(mockEntry);
    });

    it('should throw NotFoundException when the record does not exist', async () => {
      mockPrismaService.skillMatrix.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = { topicId: 3, value: 80 };

    it('should create and return the entry with user and topic', async () => {
      mockPrismaService.skillMatrix.create.mockResolvedValue(mockEntry);

      const result = await service.create(10, dto);

      expect(result).toEqual(mockEntry);
      expect(mockPrismaService.skillMatrix.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { userId: 10, topicId: 3, value: 80 },
        }),
      );
    });

    it('should throw ConflictException when the same topic already has an entry (P2002)', async () => {
      const p2002 = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '7.0.0' },
      );
      mockPrismaService.skillMatrix.create.mockRejectedValue(p2002);

      await expect(service.create(10, dto)).rejects.toThrow(ConflictException);
    });

    it('should re-throw unexpected errors unchanged', async () => {
      const unexpected = new Error('DB connection lost');
      mockPrismaService.skillMatrix.create.mockRejectedValue(unexpected);

      await expect(service.create(10, dto)).rejects.toThrow(
        'DB connection lost',
      );
    });
  });

  describe('update', () => {
    const dto = { value: 90 };

    it('should update and return the entry when the caller owns it', async () => {
      const updated = { ...mockEntry, value: 90 };
      mockPrismaService.skillMatrix.findUnique.mockResolvedValue(mockEntry);
      mockPrismaService.skillMatrix.update.mockResolvedValue(updated);

      const result = await service.update(10, 1, dto);

      expect(result.value).toBe(90);
      expect(mockPrismaService.skillMatrix.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('should throw NotFoundException when the entry does not exist', async () => {
      mockPrismaService.skillMatrix.findUnique.mockResolvedValue(null);

      await expect(service.update(10, 99, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.skillMatrix.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when caller does not own the entry', async () => {
      mockPrismaService.skillMatrix.findUnique.mockResolvedValue(mockEntry);

      await expect(service.update(99, 1, dto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockPrismaService.skillMatrix.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete and return the entry when the caller owns it', async () => {
      mockPrismaService.skillMatrix.findUnique.mockResolvedValue(mockEntry);
      mockPrismaService.skillMatrix.delete.mockResolvedValue(mockEntry);

      const result = await service.remove(10, 1);

      expect(result).toEqual(mockEntry);
      expect(mockPrismaService.skillMatrix.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when the entry does not exist', async () => {
      mockPrismaService.skillMatrix.findUnique.mockResolvedValue(null);

      await expect(service.remove(10, 99)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.skillMatrix.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException and NOT delete when caller does not own the entry', async () => {
      mockPrismaService.skillMatrix.findUnique.mockResolvedValue(mockEntry);

      await expect(service.remove(99, 1)).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.skillMatrix.delete).not.toHaveBeenCalled();
    });
  });
});
