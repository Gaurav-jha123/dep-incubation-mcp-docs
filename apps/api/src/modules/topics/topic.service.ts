import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateTopicDto } from './dto/create-topic.dto.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;

    if (page && limit) {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.topic.findMany({
          skip,
          take: limit,
          orderBy: { id: 'asc' },
        }),
        this.prisma.topic.count(),
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

    return this.prisma.topic.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: {
        skillMatrix: true,
      },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with id ${id} not found`);
    }

    return topic;
  }

  async create(dto: CreateTopicDto) {
    return this.prisma.topic.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateTopicDto) {
    await this.findOne(id);

    return this.prisma.topic.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.topic.delete({
      where: { id },
    });
  }
}
