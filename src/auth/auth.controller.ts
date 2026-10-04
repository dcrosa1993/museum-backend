import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

import { CurrentUser } from './decorators/current-user.decorator.js';

import { User } from '../users/entities/user.entity.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Obtener usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    type: User,
  })
  getCurrentUser(@CurrentUser() user: User): User {
    return user;
  }
}
