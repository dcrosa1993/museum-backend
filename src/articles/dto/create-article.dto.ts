import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Las Parrandas de Remedios',
    description: 'Título del artículo',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'Historia de las tradicionales parrandas de Remedios.',
    description: 'Contenido del artículo',
  })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    example: 'parrandas',
    description: 'Categoría del artículo',
  })
  @IsString()
  @MaxLength(100)
  category: string;
}
