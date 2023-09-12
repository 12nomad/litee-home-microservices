import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';

export const AuthUser = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const user: User = context.switchToHttp().getRequest().user;
    if (key) return user[key];

    return user;
  },
);
