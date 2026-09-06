import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';
import { randomUUID } from 'crypto';

import { ArticlesService } from './articles.service.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { FindArticlesDto } from './dto/find-articles.dto.js';
import { Article } from './entities/article.entity.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un artículo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'category'],
      properties: {
        title: {
          type: 'string',
          example: 'Las Parrandas de Remedios',
        },
        description: {
          type: 'string',
          example: 'Historia de las tradicionales parrandas de Remedios.',
        },
        category: {
          type: 'string',
          example: 'parrandas',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Artículo creado correctamente.',
    type: Article,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no son válidos.',
  })
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './uploads/articles',

        filename: (_request, file, callback) => {
          const extension = extname(file.originalname);

          callback(null, `${randomUUID()}${extension}`);
        },
      }),

      fileFilter: (_request, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new Error('Solo se permiten imágenes.'), false);
        }

        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Article> {
    const images = (files ?? []).map(
      (file) => `/uploads/articles/${file.filename}`,
    );

    return this.articlesService.create(
      {
        ...createArticleDto,
      },
      images,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener artículos',
    description:
      'Obtiene artículos aplicando opcionalmente filtros por estado, favorito, categoría y búsqueda.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de artículos obtenida correctamente.',
    type: [Article],
  })
  findAll(@Query() filters: FindArticlesDto): Promise<Article[]> {
    return this.articlesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un artículo por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del artículo',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo encontrado correctamente.',
    type: Article,
  })
  @ApiNotFoundResponse({
    description: 'No existe un artículo con ese ID.',
  })
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un artículo',
    description:
      'Actualiza el contenido de un artículo existente. Solo se modifican los campos enviados.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'UUID del artículo',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Las Parrandas de Remedios',
        },
        description: {
          type: 'string',
          example: 'Historia actualizada de las tradicionales parrandas.',
        },
        category: {
          type: 'string',
          example: 'parrandas',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo actualizado correctamente.',
    type: Article,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no son válidos.',
  })
  @ApiNotFoundResponse({
    description: 'Artículo no encontrado.',
  })
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './uploads/articles',
        filename: (_request, file, callback) => {
          const extension = extname(file.originalname);

          callback(null, `${randomUUID()}${extension}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Article> {
    const images =
      files && files.length > 0
        ? files.map((file) => `/uploads/articles/${file.filename}`)
        : undefined;

    return this.articlesService.update(id, updateArticleDto, images);
  }
}
