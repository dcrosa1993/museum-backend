import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ArticleStatus } from '../entities/article.entity.js';

export class FindArticlesDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado',
    enum: ArticleStatus,
    example: ArticleStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiPropertyOptional({
    description: 'Filtrar artículos favoritos',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  favorite?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por categoría',
    example: 'parrandas',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Buscar en título, descripción y categoría',
    example: 'Remedios',
  })
  @IsOptional()
  @IsString()
  search?: string;
}