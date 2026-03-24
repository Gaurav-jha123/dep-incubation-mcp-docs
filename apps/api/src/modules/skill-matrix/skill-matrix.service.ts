import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSkillMatrixDto } from './dto/create-skill-matrix.dto.js';
import { UpdateSkillMatrixDto } from './dto/update-skill-matrix.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';

@Injectable()
export class SkillMatrixService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;

    const include = {
      user: { select: { id: true, name: true, email: true } },
      topic: { select: { id: true, label: true } },
    };

    if (page && limit) {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.skillMatrix.findMany({
          skip,
          take: limit,
          include,
          orderBy: { id: 'asc' },
        }),
        this.prisma.skillMatrix.count(),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    return this.prisma.skillMatrix.findMany({
      include,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.skillMatrix.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        topic: { select: { id: true, label: true } },
      },
    });

    if (!record) {
      throw new NotFoundException(`SkillMatrix with id ${id} not found`);
    }

    return record;
  }

  async create(userId: number, dto: CreateSkillMatrixDto) {
    return this.prisma.skillMatrix.create({
      data: {
        userId,
        topicId: dto.topicId,
        value: dto.value,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        topic: { select: { id: true, label: true } },
      },
    });
  }

  async update(userId: number, id: number, dto: UpdateSkillMatrixDto) {
    await this.findOne(id);

    return this.prisma.skillMatrix.update({
      where: { id, userId },
      data: dto,
      include: {
        user: { select: { id: true, name: true, email: true } },
        topic: { select: { id: true, label: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.skillMatrix.delete({
      where: { id },
    });
  }
}
