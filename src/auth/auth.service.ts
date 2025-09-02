// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Register new user
  async register(registrationData: RegisterDTO) {
    // Hash password
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    // Prepare user data
    const userData = {
      email: registrationData.email,
      role: registrationData.role || 'USER',
    };

    // Create user with UsersService
    return this.usersService.create(userData, hashedPassword);
  }

  // For login (used by LocalStrategy)
  public async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);

    if ( user && user.password ) {
      const { password, ...result } = user; // remove password
      return result;
    }
    return null;
  }

  async createSession(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });

    return { access_token: accessToken };
  }
}
