import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service.js';

import { User } from '../users/entities/user.entity.js';
import { hashPassword, verifyPassword } from './password.util.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, displayName: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser =
      await this.usersService.findByEmailForAuthentication(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('Ya existe una cuenta con este correo.');
    }

    const passwordHash = await hashPassword(password);
    const user = await this.usersService.createLocalUser(
      normalizedEmail,
      displayName.trim(),
      passwordHash,
    );

    return this.createAuthResponse(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmailForAuthentication(
      email.trim().toLowerCase(),
    );

    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('El usuario está desactivado.');
    }

    return this.createAuthResponse(await this.usersService.updateLastLogin(user));
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o desactivado.');
    }

    return user;
  }

  private async createAuthResponse(user: User) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });
    const { passwordHash, ...safeUser } = user;

    return { accessToken, user: safeUser };
  }
}
