import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModerationController } from './moderation.controller.js';
import { ModerationService } from './moderation.service.js';
import { Article } from '../articles/entities/article.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), AuthModule],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}
