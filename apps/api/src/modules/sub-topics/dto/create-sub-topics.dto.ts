import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateSubTopicDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the topic to which this sub-topic belongs',
  })
  @IsInt()
  @IsNotEmpty()
  topicId: number;

  @ApiProperty({ example: ['Advanced'], description: 'List of subtopics' })
  @IsArray()
  subTopics: string[];
}
