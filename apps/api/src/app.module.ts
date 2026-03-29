import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/index.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { SkillMatrixModule } from './modules/skill-matrix/skill-matrix.module.js';
import { TopicModule } from './modules/topics/topic.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    SkillMatrixModule,
    TopicModule,
    UsersModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
