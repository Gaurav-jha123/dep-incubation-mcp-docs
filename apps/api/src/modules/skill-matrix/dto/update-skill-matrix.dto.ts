import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSkillMatrixDto {
  @ApiPropertyOptional({ example: 1, description: 'Topic ID' })
  @IsInt()
  @IsOptional()
  topicId?: number;

  @ApiPropertyOptional({
    example: 85,
    description: 'Skill level value (0-100)',
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  value?: number;
}
