import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../modules/user/entities/user.entity';
import { Bikes } from 'modules/bikes/entities/bikes.entity';

export const GetUser = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;

    return data ? user[data] : user;
  },
);
