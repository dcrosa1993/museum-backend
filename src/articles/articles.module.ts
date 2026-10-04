import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesController } from './articles.controller.js';
import { ArticlesService } from './articles.service.js';
import { Article } from './entities/article.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), AuthModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, JwtAuthGuard],
  exports: [ArticlesService],
})
export class ArticlesModule {}
