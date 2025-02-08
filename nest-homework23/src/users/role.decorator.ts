import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Role = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      console.log(request.role,(request.role))
    return request.role;
  },
);
