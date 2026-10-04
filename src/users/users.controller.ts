import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { User, UserRole } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMINISTRATOR)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios para administración' })
  @ApiResponse({ status: 200, type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Cambiar el rol de un usuario' })
  @ApiResponse({ status: 200, type: User })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  updateRole(@Param('id') id: string, @Body() body: UpdateUserRoleDto): Promise<User> {
    return this.usersService.updateRole(id, body.role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activar o desactivar un usuario' })
  @ApiResponse({ status: 200, type: User })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateUserStatusDto,
  ): Promise<User> {
    return this.usersService.updateActiveStatus(id, body.isActive);
  }
}