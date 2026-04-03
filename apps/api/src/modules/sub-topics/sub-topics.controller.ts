import { UseGuards, Controller, Body, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles, Role } from '../auth/decorators/roles.decorator.js';
import { CreateSubTopicDto } from './dto/create-sub-topics.dto.js';
import { SubTopicService } from './sub-topics.service.js';

@ApiTags('SubTopics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sub-topics')
export class SubTopicController {
  constructor(private readonly subTopicService: SubTopicService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create sub-topic' })
  @ApiResponse({ status: 201, description: 'Sub-topic created' })
  create(@Body() dto: CreateSubTopicDto) {
    return this.subTopicService.create(dto);
  }
}
