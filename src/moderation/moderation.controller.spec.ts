import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { vi } from 'vitest';
import { ModerationController } from './moderation.controller.js';
import { ModerationService } from './moderation.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';

describe('ModerationController', () => {
  let controller: ModerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModerationController],
      providers: [
        {
          provide: ModerationService,
          useValue: {
            approve: vi.fn(),
            reject: vi.fn(),
            favorite: vi.fn(),
            unfavorite: vi.fn(),
          },
        },
        JwtAuthGuard,
        RolesGuard,
        Reflector,
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

    controller = module.get<ModerationController>(ModerationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
