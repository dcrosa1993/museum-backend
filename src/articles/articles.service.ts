import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article, ArticleStatus } from './entities/article.entity.js';

import { CreateArticleDto } from './dto/create-article.dto.js';
import { FindArticlesDto } from './dto/find-articles.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    images: string[],
  ): Promise<Article> {
    const article = this.articlesRepository.create({
      ...createArticleDto,

      images,

      status: ArticleStatus.PENDING,

      favorite: false,

      createdBy: null,
    });

    return this.articlesRepository.save(article);
  }

  async findAll(filters: FindArticlesDto): Promise<Article[]> {
    const query = this.articlesRepository.createQueryBuilder('article');

    if (filters.status) {
      query.andWhere('article.status = :status', {
        status: filters.status,
      });
    }

    if (filters.favorite !== undefined) {
      query.andWhere('article.favorite = :favorite', {
        favorite: filters.favorite,
      });
    }

    if (filters.category) {
      query.andWhere('LOWER(article.category) = LOWER(:category)', {
        category: filters.category,
      });
    }

    if (filters.search) {
      query.andWhere(
        `(
          LOWER(article.title) LIKE LOWER(:search)
          OR LOWER(article.description) LIKE LOWER(:search)
          OR LOWER(article.category) LIKE LOWER(:search)
        )`,
        {
          search: `%${filters.search}%`,
        },
      );
    }

    return query.orderBy('article.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Artículo con id "${id}" no encontrado`);
    }

    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    images?: string[],
  ): Promise<Article> {
    const article = await this.findOne(id);

    Object.assign(article, updateArticleDto);

    if (images !== undefined) {
      article.images = images;
    }

    article.updatedBy = null;

    return this.articlesRepository.save(article);
  }
}
