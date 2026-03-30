import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
  IsISO8601,
  MinLength,
} from 'class-validator';
import {
  ProjectType,
  ProjectStatus,
} from '../../../generated/prisma/client.js';

export class CreateProjectDto {
  @ApiProperty({ example: 'Client Portal Alpha' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'Frontend portal for Acme Corp' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProjectType, example: ProjectType.CLIENT })
  @IsEnum(ProjectType)
  type: ProjectType;

  @ApiPropertyOptional({ enum: ProjectStatus, example: ProjectStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Topic IDs required for this project',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  skillIds?: number[];
}
