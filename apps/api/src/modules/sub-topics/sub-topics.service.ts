import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSubTopicDto } from './dto/create-sub-topics.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class SubTopicService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubTopicDto) {
    try {
      const { topicId, subTopics } = dto;

      const subTopicLabelsAlreadyExist = [];

      for (let i = 0; i < subTopics.length; i++) {
        const subTopic = subTopics[i];
        const isSubTopicExist = await this.prisma.subTopic.findFirst({
          where: {
            topicId: topicId,
            label: subTopic,
          },
        });
        if (isSubTopicExist) {
          subTopicLabelsAlreadyExist.push(subTopic);
        } else {
          await this.prisma.subTopic.create({
            data: {
              topicId: topicId,
              label: subTopic,
            },
          });
        }
      }
      if (
        subTopicLabelsAlreadyExist.length > 0 &&
        subTopicLabelsAlreadyExist.length === subTopics.length
      ) {
        throw new ConflictException('Sub-topic already exists for this topic');
      }
      return {
        message:
          subTopicLabelsAlreadyExist.length > 0
            ? `Sub-topics created successfully, but the following already existed: ${subTopicLabelsAlreadyExist.join(', ')}`
            : 'Sub-topics created successfully',
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Sub-topic already exists for this topic');
      }
      throw error;
    }
  }
}
