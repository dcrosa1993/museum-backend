import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiProperty,
} from '@nestjs/swagger';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

import { CurrentUser } from './decorators/current-user.decorator.js';

import { User, UserRole } from '../users/entities/user.entity.js';

class AuthUserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ type: String, nullable: true, example: null })
  googleId: string | null;

  @ApiProperty({ example: 'colaborador@museo.cu' })
  email: string;

  @ApiProperty({ example: 'Ana Pérez' })
  displayName: string;

  @ApiProperty({ type: String, nullable: true, example: null })
  photoUrl: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.COLLABORATOR })
  role: UserRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  lastLoginAt: Date | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;
}

class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user: AuthUserResponseDto;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar una cuenta con correo y contraseña' })
  @ApiCreatedResponse({
    description: 'Cuenta creada y autenticada correctamente.',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'El correo, nombre o contraseña no son válidos.' })
  @ApiConflictResponse({ description: 'Ya existe una cuenta con este correo.' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.displayName);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con correo y contraseña' })
  @ApiCreatedResponse({
    description: 'Usuario autenticado correctamente.',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'El correo o la contraseña no tienen un formato válido.' })
  @ApiUnauthorizedResponse({ description: 'Correo o contraseña incorrectos.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
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
