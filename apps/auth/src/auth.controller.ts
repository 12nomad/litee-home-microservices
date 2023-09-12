import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthUser } from '@app/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @AuthUser('sub') sub: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(sub, response);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
