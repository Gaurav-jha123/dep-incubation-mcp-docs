import { IsString, IsOptional } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  description?: string;
}
