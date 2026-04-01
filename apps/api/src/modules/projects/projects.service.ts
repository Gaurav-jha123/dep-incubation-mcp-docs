import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { AssignUserDto } from './dto/assign-user.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({
      orderBy: { id: 'asc' },
      include: {
        skills: { include: { topic: true } },
        _count: { select: { assignments: true } },
      },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        skills: { include: { topic: true } },
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return project;
  }

  async create(dto: CreateProjectDto) {
    const { skillIds, startDate, endDate, ...rest } = dto;

    const project = await this.prisma.project.create({
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    if (skillIds && skillIds.length > 0) {
      await this.prisma.projectSkill.createMany({
        data: skillIds.map((topicId) => ({ projectId: project.id, topicId })),
      });
    }

    return this.findOne(project.id);
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id);

    const { skillIds, startDate, endDate, ...rest } = dto;

    await this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    if (skillIds !== undefined) {
      await this.prisma.projectSkill.deleteMany({ where: { projectId: id } });
      if (skillIds.length > 0) {
        await this.prisma.projectSkill.createMany({
          data: skillIds.map((topicId) => ({ projectId: id, topicId })),
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }

  async assignUser(projectId: number, dto: AssignUserDto) {
    await this.findOne(projectId);
    try {
      await this.prisma.projectAssignment.create({
        data: {
          projectId,
          userId: dto.userId,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        },
      });
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new ConflictException(
          `User #${dto.userId} is already assigned to project #${projectId}`,
        );
      }
      throw err;
    }
    return this.findOne(projectId);
  }

  async removeUser(projectId: number, userId: number) {
    await this.findOne(projectId);
    await this.prisma.projectAssignment.delete({
      where: { userId_projectId: { userId, projectId } },
    });
    return this.findOne(projectId);
  }
}
