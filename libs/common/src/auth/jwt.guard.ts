import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Observable, map, tap } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { Request } from "express";

import { AUTH_SERVICE } from "../constants";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const bearer: string | undefined = req.headers["authorization"];
    const token = bearer ? bearer.split(" ")[1] : "";

    if (!token) return false;

    return this.authClient
      .send("authenticate", {
        authorization: bearer,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
      );
  }
}
