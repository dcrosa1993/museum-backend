import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity.js';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.COLLABORATOR })
  @IsEnum(UserRole)
  role: UserRole;
}