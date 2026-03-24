import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe', description: 'Username to create' })
  @IsString()
  @IsNotEmpty()
  username!: string;
}
