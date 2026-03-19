import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillMatrixDto {
  @ApiProperty({ example: 1, description: 'Topic ID' })
  @IsInt()
  @IsNotEmpty()
  topicId!: number;

  @ApiProperty({ example: 75, description: 'Skill level value (0-100)' })
  @IsInt()
  @Min(0)
  @Max(100)
  value!: number;
}
