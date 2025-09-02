// src/auth/dto/register.dto.ts
import { IsString, Length, IsNotEmpty, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Match } from 'src/utils/match.decorator';
import { Role } from '@prisma/client';

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 40)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsNotEmpty()
  @IsString()
  @Length(5, 40)
  @Match('password')
  passwordRepeat: string;
}
