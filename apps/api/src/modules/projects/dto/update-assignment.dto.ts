import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AssignmentStatus } from '../../../generated/prisma/client.js';

export class UpdateAssignmentStatusDto {
  @ApiProperty({ enum: AssignmentStatus, example: AssignmentStatus.ASSIGNED })
  @IsEnum(AssignmentStatus)
  status: AssignmentStatus;
}
