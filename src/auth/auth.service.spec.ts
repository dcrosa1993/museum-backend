import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { UserRole } from '../users/entities/user.entity.js';
import { hashPassword } from './password.util.js';

const user = {
  id: 'user-id',
  email: 'person@example.com',
  displayName: 'Museum Member',
  googleId: null,
  photoUrl: null,
  passwordHash: null,
  role: UserRole.COLLABORATOR,
  isActive: true,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmailForAuthentication: ReturnType<typeof vi.fn>;
    createLocalUser: ReturnType<typeof vi.fn>;
    updateLastLogin: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
  };
  let jwtService: { signAsync: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    usersService = {
      findByEmailForAuthentication: vi.fn(),
      createLocalUser: vi.fn(),
      updateLastLogin: vi.fn(),
      findById: vi.fn(),
    };
    jwtService = { signAsync: vi.fn().mockResolvedValue('signed-jwt') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('registers a normalized email and returns an application JWT', async () => {
    usersService.findByEmailForAuthentication.mockResolvedValue(null);
    usersService.createLocalUser.mockImplementation(
      async (_email: string, _name: string, passwordHash: string) => ({
        ...user,
        passwordHash,
      }),
    );

    const result = await service.register(
      '  Person@Example.com ',
      'strong-password',
      ' Museum Member ',
    );

    expect(usersService.createLocalUser).toHaveBeenCalledWith(
      'person@example.com',
      'Museum Member',
      expect.any(String),
    );
    expect(result.accessToken).toBe('signed-jwt');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects registration when the email is already in use', async () => {
    usersService.findByEmailForAuthentication.mockResolvedValue(user);

    await expect(
      service.register('person@example.com', 'strong-password', 'Member'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects login when the password does not match', async () => {
    const passwordHash = await hashPassword('correct-password');
    usersService.findByEmailForAuthentication.mockResolvedValue({
      ...user,
      passwordHash,
    });

    await expect(
      service.login(' PERSON@example.com ', 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('authenticates a valid account and updates last login', async () => {
    const passwordHash = await hashPassword('correct-password');
    usersService.findByEmailForAuthentication.mockResolvedValue({
      ...user,
      passwordHash,
    });
    usersService.updateLastLogin.mockImplementation(async (record) => record);

    const result = await service.login(' PERSON@example.com ', 'correct-password');

    expect(usersService.findByEmailForAuthentication).toHaveBeenCalledWith(
      'person@example.com',
    );
    expect(usersService.updateLastLogin).toHaveBeenCalledOnce();
    expect(result.accessToken).toBe('signed-jwt');
    expect(result.user).not.toHaveProperty('passwordHash');
  });
});
