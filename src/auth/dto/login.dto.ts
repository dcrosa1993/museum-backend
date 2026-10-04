import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'colaborador@museo.cu', maxLength: 320 })
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiProperty({ example: 'Museo2026!', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}