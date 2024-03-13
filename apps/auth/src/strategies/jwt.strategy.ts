import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { UsersService } from "../users/users.service";
import { TokenPayload } from "@app/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          return (
            (req["authorization"] as string)?.split(" ")[1] ||
            (req.headers["authorization"] as string)?.split(" ")[1]
          );
        },
      ]),
      secretOrKey: configService.get<string>("JWT_PUBLIC"),
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOne(payload.sub);
  }
}
