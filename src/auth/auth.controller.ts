import { Controller, Get, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FirebaseAuthGuard } from './guards/firebase-auth.guard.js';

import { CurrentUser } from './decorators/current-user.decorator.js';

import { User } from '../users/entities/user.entity.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente.',
    type: User,
  })
  getCurrentUser(@CurrentUser() user: User): User {
    return user;
  }
}
