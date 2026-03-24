import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SkillMatrixService } from './skill-matrix.service.js';
import { CreateSkillMatrixDto } from './dto/create-skill-matrix.dto.js';
import { UpdateSkillMatrixDto } from './dto/update-skill-matrix.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Skill Matrix')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skill-matrix')
export class SkillMatrixController {
  constructor(private readonly skillMatrixService: SkillMatrixService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all skill matrix entries',
    description:
      'Returns all entries by default. Pass page and limit query params for paginated results.',
  })
  @ApiResponse({ status: 200, description: 'List of skill matrix entries' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.skillMatrixService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a skill matrix entry by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Skill matrix entry found' })
  @ApiResponse({ status: 404, description: 'Skill matrix entry not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.skillMatrixService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new skill matrix entry' })
  @ApiResponse({
    status: 201,
    description: 'Skill matrix entry created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Request() req: { user: { id: number } },
    @Body() dto: CreateSkillMatrixDto,
  ) {
    return this.skillMatrixService.create(req.user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a skill matrix entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Skill matrix entry updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — not your entry' })
  @ApiResponse({ status: 404, description: 'Skill matrix entry not found' })
  update(
    @Request() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillMatrixDto,
  ) {
    return this.skillMatrixService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a skill matrix entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Skill matrix entry deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — not your entry' })
  @ApiResponse({ status: 404, description: 'Skill matrix entry not found' })
  remove(
    @Request() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.skillMatrixService.remove(req.user.id, id);
  }
}
