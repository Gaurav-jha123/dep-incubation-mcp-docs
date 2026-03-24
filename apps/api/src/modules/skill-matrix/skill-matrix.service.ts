import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';
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
    try {
      return await this.prisma.skillMatrix.create({
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Skill matrix entry already exists for this topic',
        );
      }
      throw error;
    }
  }

  async update(userId: number, id: number, dto: UpdateSkillMatrixDto) {
    const record = await this.findOne(id);

    if (record.userId !== userId) {
      throw new ForbiddenException('You do not own this skill matrix entry');
    }

    return this.prisma.skillMatrix.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, name: true, email: true } },
        topic: { select: { id: true, label: true } },
      },
    });
  }

  async remove(userId: number, id: number) {
    const record = await this.findOne(id);

    if (record.userId !== userId) {
      throw new ForbiddenException('You do not own this skill matrix entry');
    }

    return this.prisma.skillMatrix.delete({
      where: { id },
    });
  }
}
