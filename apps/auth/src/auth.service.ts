import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(sub: number, response: Response) {
    const token = this.jwtService.sign(
      { sub },
      {
        secret: this.configService.get<string>('JWT_PRIVATE'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_TTL'),
      },
    );
    return response.cookie('__litee_home_access_token', token, {
      httpOnly: true,
      secure: true,
    });
  }
}
