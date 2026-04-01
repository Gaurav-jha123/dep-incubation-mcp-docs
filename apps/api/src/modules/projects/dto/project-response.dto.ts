import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ProjectStatus,
  ProjectType,
  AssignmentStatus,
} from '../../../generated/prisma/client.js';

export class SkillDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'React' })
  label: string;
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

  @ApiProperty({
    enum: AssignmentStatus,
    example: AssignmentStatus.PRESELECTED,
  })
  status: AssignmentStatus;

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

  @ApiProperty({ example: 'UKG-HPAY' })
  code: string;

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

  @ApiProperty({ type: () => [SkillDto] })
  skills: SkillDto[];

  @ApiProperty({ type: () => AssignmentCountDto })
  _count: AssignmentCountDto;
}

export class ProjectDetailDto extends ProjectResponseDto {
  @ApiProperty({ type: () => [ProjectAssignmentDto] })
  assignments: ProjectAssignmentDto[];
}
