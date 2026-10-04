import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { vi } from 'vitest';
import { ArticlesController } from './articles.controller.js';
import { ArticlesService } from './articles.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UsersService } from '../users/users.service.js';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: {
            create: vi.fn(),
            findAll: vi.fn(),
            findOne: vi.fn(),
            update: vi.fn(),
          },
        },
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: vi.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
