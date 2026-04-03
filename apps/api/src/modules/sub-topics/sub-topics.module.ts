import { Module } from '@nestjs/common';
import { SubTopicController } from './sub-topics.controller.js';
import { SubTopicService } from './sub-topics.service.js';

@Module({
  controllers: [SubTopicController],
  providers: [SubTopicService],
  exports: [SubTopicService],
})
export class SubTopicModule {}
