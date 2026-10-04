import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModerationController } from './moderation.controller.js';
import { ModerationService } from './moderation.service.js';
import { Article } from '../articles/entities/article.entity.js';

import { UsersModule } from '../users/users.module.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UsersModule],
  controllers: [ModerationController],
  providers: [ModerationService, RolesGuard, JwtService],
})
export class ModerationModule {}
