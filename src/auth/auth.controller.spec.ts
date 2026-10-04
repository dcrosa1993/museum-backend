import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: vi.fn(),
            register: vi.fn(),
            getCurrentUser: vi.fn(),
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
