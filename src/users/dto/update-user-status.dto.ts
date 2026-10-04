import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive: boolean;
}