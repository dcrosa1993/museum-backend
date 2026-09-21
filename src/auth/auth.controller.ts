import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

import { CurrentUser } from './decorators/current-user.decorator.js';

import { User } from '../users/entities/user.entity.js';

class GoogleLoginDto {
  credential: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @ApiOperation({
    summary: 'Autenticar mediante Google',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario autenticado correctamente.',
  })
  async googleLogin(
    @Body()
    body: GoogleLoginDto,
  ) {
    return this.authService.loginWithGoogle(body.credential);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
