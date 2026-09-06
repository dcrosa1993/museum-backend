import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModerationController } from './moderation.controller.js';
import { ModerationService } from './moderation.service.js';
import { Article } from '../articles/entities/article.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}
