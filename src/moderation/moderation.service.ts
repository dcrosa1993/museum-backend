import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article, ArticleStatus } from '../articles/entities/article.entity.js';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async approve(id: string): Promise<Article> {
    const article = await this.findArticle(id);

    article.status = ArticleStatus.APPROVED;

    return this.articlesRepository.save(article);
  }

  async reject(id: string): Promise<Article> {
    const article = await this.findArticle(id);

    article.status = ArticleStatus.DELETED;

    return this.articlesRepository.save(article);
  }

  async favorite(id: string): Promise<Article> {
    const article = await this.findArticle(id);

    article.favorite = true;

    return this.articlesRepository.save(article);
  }

  async unfavorite(id: string): Promise<Article> {
    const article = await this.findArticle(id);

    article.favorite = false;

    return this.articlesRepository.save(article);
  }

  private async findArticle(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Artículo con id "${id}" no encontrado`);
    }

    return article;
  }
}
