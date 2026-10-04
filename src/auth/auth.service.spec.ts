import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { GoogleAuthService } from './google-auth.service.js';
import { UsersService } from '../users/users.service.js';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: GoogleAuthService,
          useValue: {
            verifyIdToken: vi.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOrCreateFromGoogle: vi.fn(),
            findById: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn(),
            verifyAsync: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
