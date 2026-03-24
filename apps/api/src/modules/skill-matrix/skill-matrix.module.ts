import { Module } from '@nestjs/common';
import { SkillMatrixController } from './skill-matrix.controller.js';
import { SkillMatrixService } from './skill-matrix.service.js';

@Module({
  controllers: [SkillMatrixController],
  providers: [SkillMatrixService],
  exports: [SkillMatrixService],
})
export class SkillMatrixModule {}
