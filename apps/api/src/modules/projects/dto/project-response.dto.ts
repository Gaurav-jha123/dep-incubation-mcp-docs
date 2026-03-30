import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ProjectStatus,
  ProjectType,
} from '../../../generated/prisma/client.js';

export class TopicDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'React' })
  label: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  description: string | null;
}

export class ProjectSkillDto {
  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: 3 })
  topicId: number;

  @ApiProperty({ type: () => TopicDto })
  topic: TopicDto;
}

export class AssignedUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alex Johnson' })
  name: string;

  @ApiProperty({ example: 'alex.johnson@example.com' })
  email: string;

  @ApiProperty({ enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'], example: 'EMPLOYEE' })
  role: string;
}

export class ProjectAssignmentDto {
  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: 2 })
  userId: number;

  @ApiPropertyOptional({ example: '2025-09-01T00:00:00.000Z', nullable: true })
  startDate: Date | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  endDate: Date | null;

  @ApiProperty({ type: () => AssignedUserDto })
  user: AssignedUserDto;
}

class AssignmentCountDto {
  @ApiProperty({ example: 4 })
  assignments: number;
}

export class ProjectResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Client Portal Alpha' })
  name: string;

  @ApiPropertyOptional({
    example: 'Customer-facing portal for Acme Corp',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ enum: ProjectType, example: ProjectType.CLIENT })
  type: ProjectType;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @ApiPropertyOptional({ example: 'Acme Corp', nullable: true })
  clientName: string | null;

  @ApiPropertyOptional({ example: '2025-09-01T00:00:00.000Z', nullable: true })
  startDate: Date | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  endDate: Date | null;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: () => [ProjectSkillDto] })
  skills: ProjectSkillDto[];

  @ApiProperty({ type: () => AssignmentCountDto })
  _count: AssignmentCountDto;
}

export class ProjectDetailDto extends ProjectResponseDto {
  @ApiProperty({ type: () => [ProjectAssignmentDto] })
  assignments: ProjectAssignmentDto[];
}
