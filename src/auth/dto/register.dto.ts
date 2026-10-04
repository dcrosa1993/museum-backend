import { IsString, MaxLength, MinLength } from 'class-validator';
import { LoginDto } from './login.dto.js';

export class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  displayName: string;
}