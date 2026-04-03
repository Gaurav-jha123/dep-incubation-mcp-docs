import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { AssignUserDto } from './dto/assign-user.dto.js';
import { UpdateAssignmentStatusDto } from './dto/update-assignment.dto.js';
import { Role } from '../../generated/prisma/client.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveSkills(skillIds: number[]) {
    if (!skillIds.length) return [];
    const topics = await this.prisma.topic.findMany({
      where: { id: { in: skillIds } },
      select: { id: true, label: true },
    });
    return skillIds
      .map((id) => topics.find((t) => t.id === id))
      .filter(Boolean) as { id: number; label: string }[];
  }

  async findAll() {
    const projects = await this.prisma.project.findMany({
      orderBy: { id: 'asc' },
      include: { _count: { select: { assignments: true } } },
    });

    const allSkillIds = [...new Set(projects.flatMap((p) => p.skillIds))];
    const topicMap = new Map(
      allSkillIds.length
        ? (
            await this.prisma.topic.findMany({
              where: { id: { in: allSkillIds } },
              select: { id: true, label: true },
            })
          ).map((t) => [t.id, t])
        : [],
    );

    return projects.map(({ skillIds, ...p }) => ({
      ...p,
      skills: skillIds.map((id) => topicMap.get(id)).filter(Boolean),
    }));
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
        _count: { select: { assignments: true } },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    const skills = await this.resolveSkills(project.skillIds);
    const { skillIds: _, ...projectWithoutIds } = project;
    return { ...projectWithoutIds, skills };
  }

  async create(dto: CreateProjectDto) {
    const { skillIds = [], userIds = [], startDate, endDate, ...rest } = dto;

    try {
      const project = await this.prisma.project.create({
        data: {
          ...rest,
          skillIds,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      });

      if (userIds.length > 0) {
        await this.prisma.projectAssignment.createMany({
          data: userIds.map((userId) => ({
            projectId: project.id,
            userId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
          })),
        });
      }

      return this.findOne(project.id);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new ConflictException(
          `Project with code "${dto.code}" already exists`,
        );
      }
      throw err;
    }
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id);

    const { skillIds, startDate, endDate, ...rest } = dto;

    await this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(skillIds !== undefined && { skillIds }),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

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

  async updateAssignmentStatus(
    projectId: number,
    userId: number,
    dto: UpdateAssignmentStatusDto,
    requestingUser: { id: number; role: Role },
  ) {
    await this.findOne(projectId);

    const isAdminOrManager =
      requestingUser.role === Role.ADMIN ||
      requestingUser.role === Role.MANAGER;

    if (!isAdminOrManager && requestingUser.id !== userId) {
      throw new ForbiddenException(
        'You can only update your own assignment status',
      );
    }

    try {
      await this.prisma.projectAssignment.update({
        where: { userId_projectId: { userId, projectId } },
        data: { status: dto.status },
      });
    } catch (err: any) {
      if (err?.code === 'P2025') {
        throw new NotFoundException(
          `User #${userId} is not assigned to project #${projectId}`,
        );
      }
      throw err;
    }

    return this.findOne(projectId);
  }
}
