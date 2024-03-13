import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const AuthUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest().user,
);
