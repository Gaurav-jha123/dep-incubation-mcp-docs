import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTopicDto {
  @ApiPropertyOptional({
    example: 'JavaScript',
    description: 'Topic label',
  })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({
    example: 'Core concepts of JS like closures, promises, etc.',
    description: 'Topic description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
