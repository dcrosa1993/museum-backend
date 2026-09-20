import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesController } from './articles.controller.js';
import { ArticlesService } from './articles.service.js';
import { Article } from './entities/article.entity.js';

import { FirebaseModule } from '../firebase/firebase.module.js';
import { UsersModule } from '../users/users.module.js';

import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), FirebaseModule, UsersModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, FirebaseAuthGuard],
  exports: [ArticlesService],
})
export class ArticlesModule {}
