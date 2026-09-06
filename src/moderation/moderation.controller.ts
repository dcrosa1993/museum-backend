import { Controller, Param, Patch } from '@nestjs/common';

import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ModerationService } from './moderation.service.js';
import { Article } from '../articles/entities/article.entity.js';

@ApiTags('Moderation')
@Controller('moderation')
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
