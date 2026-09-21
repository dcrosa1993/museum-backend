import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity.js';

import { Roles } from '../auth/decorators/roles.decorator.js';

import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard.js';

import { RolesGuard } from '../auth/guards/roles.guard.js';

import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ModerationService } from './moderation.service.js';
import { Article } from '../articles/entities/article.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Moderation')
@Controller('moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMINISTRATOR)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Patch('articles/:id/approve')
  @ApiOperation({
    summary: 'Aprobar un artículo',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del artículo',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo aprobado correctamente.',
    type: Article,
  })
  @ApiNotFoundResponse({
    description: 'Artículo no encontrado.',
  })
  approve(@Param('id') id: string): Promise<Article> {
    return this.moderationService.approve(id);
  }

  @Patch('articles/:id/reject')
  @ApiOperation({
    summary: 'Eliminar un artículo',
    description:
      'Marca el artículo como deleted sin eliminarlo físicamente de la base de datos.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del artículo',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo eliminado correctamente.',
    type: Article,
  })
  @ApiNotFoundResponse({
    description: 'Artículo no encontrado.',
  })
  reject(@Param('id') id: string): Promise<Article> {
    return this.moderationService.reject(id);
  }

  @Patch('articles/:id/favorite')
  @ApiOperation({
    summary: 'Marcar artículo como favorito',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del artículo',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo marcado como favorito.',
    type: Article,
  })
  favorite(@Param('id') id: string): Promise<Article> {
    return this.moderationService.favorite(id);
  }

  @Patch('articles/:id/unfavorite')
  @ApiOperation({
    summary: 'Quitar artículo de favoritos',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del artículo',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo quitado de favoritos.',
    type: Article,
  })
  unfavorite(@Param('id') id: string): Promise<Article> {
    return this.moderationService.unfavorite(id);
  }
}
