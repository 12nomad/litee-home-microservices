import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map, tap } from 'rxjs';
import { User } from '@prisma/client';

import { AUTH_SERVICE } from '../../constants/service.constant';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies[
      '__litee_home_access_token'
    ];

    if (!jwt) return false;

    return this.authClient
      .send<User>('authenticate', {
        __litee_home_access_token: jwt,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
      );
  }
}
