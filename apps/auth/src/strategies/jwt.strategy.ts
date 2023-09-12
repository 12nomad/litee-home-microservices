import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.fromCookies]),
      secretOrKey: configService.get<string>('JWT_PUBLIC'),
      ignoreExpiration: false,
    });
  }

  private static fromCookies(@Req() req: any): string | null {
    return (
      req.cookies['__litee_home_access_token'] ||
      req['__litee_home_access_token']
    );
  }

  async validate(payload: { sub: number }) {
    return this.userService.getUser(payload.sub);
  }
}
