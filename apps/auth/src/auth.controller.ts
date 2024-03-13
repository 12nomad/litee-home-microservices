import { Controller, Post, UseGuards } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { AuthService } from "./auth.service";
import { LocalGuard } from "./guards/local.guard";
import { UserDocument } from "./users/user.schema";
import { JwtGuard } from "./guards/jwt.guard";
import { AuthUser } from "@app/common";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post("login")
  login(@AuthUser() authUser: UserDocument) {
    return this.authService.login(authUser);
  }

  @UseGuards(JwtGuard)
  @MessagePattern("authenticate")
  async authenticate(@Payload() data: any) {
    return await data.user;
  }
}
