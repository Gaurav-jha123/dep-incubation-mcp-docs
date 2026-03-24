import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'john.updated', description: 'Updated username' })
  @IsString()
  @IsNotEmpty()
  username!: string;
}
