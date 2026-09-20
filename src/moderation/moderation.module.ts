import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModerationController } from './moderation.controller.js';
import { ModerationService } from './moderation.service.js';
import { Article } from '../articles/entities/article.entity.js';

import { FirebaseModule } from '../firebase/firebase.module.js';
import { UsersModule } from '../users/users.module.js';

import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), FirebaseModule, UsersModule],
  controllers: [ModerationController],
  providers: [ModerationService, FirebaseAuthGuard, RolesGuard],
})
export class ModerationModule {}
