import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login.dto.js';

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: 'Ana Pérez', minLength: 2, maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  displayName: string;
}