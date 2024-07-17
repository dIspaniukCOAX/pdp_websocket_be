import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../modules/user/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;

    return data ? user[data] : user;
  },
);
