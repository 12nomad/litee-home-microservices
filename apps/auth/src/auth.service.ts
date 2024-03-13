import { Injectable } from "@nestjs/common";
import { UserDocument } from "./users/user.schema";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(authUser: UserDocument): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign({ sub: authUser._id.toHexString() }),
    };
  }
}
