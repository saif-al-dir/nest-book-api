// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async register(registrationData: RegisterDTO) {
    // Hash password
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    // Prepare user data
    const userData = {
      email: registrationData.email,
    };

    // Create user with UsersService
    return this.usersService.create(userData, hashedPassword);
  }

  // For login (used by LocalStrategy)
  public async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);

    if (user && user.password && (await bcrypt.compare(password, user.password.hashedPassword))) {
      const { password, ...result } = user; // remove password
      return result;
    }
    return null;
  }
}
