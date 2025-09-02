import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Read cookie
          const data = request?.cookies['auth'];
          if (!data) return null;

          // If cookie is a JSON string → parse
          try {
            const parsed = JSON.parse(data);
            return parsed.access_token;
          } catch {
            // If cookie is already just a token string
            return data.access_token || data;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    // Payload has: { email, sub: userId }
    const user = await this.usersService.getById(payload.sub);
    return user; // attaches full user (with role) to req.user
  }
}
