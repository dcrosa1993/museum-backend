import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { GoogleAuthService } from './google-auth.service.js';

import { UsersService } from '../users/users.service.js';

import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleAuthService: GoogleAuthService,

    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  async loginWithGoogle(credential: string) {
    const profile = await this.googleAuthService.verifyIdToken(credential);

    const user = await this.usersService.findOrCreateFromGoogle(profile);

    if (!user.isActive) {
      throw new UnauthorizedException('El usuario está desactivado.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return {
      accessToken,
      user,
    };
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o desactivado.');
    }

    return user;
  }
}
