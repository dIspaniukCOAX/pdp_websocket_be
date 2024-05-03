import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller({ path: 'host/user' })
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Get current user profile using JWT token',
  })
  @ApiOkResponse({
    description: 'Current user profile',
    type: () => User,
  })
  @ApiBearerAuth()
  async getCurrentUser(@Req() req: Request) {
    const user: User = <User>req.user;

    return this.userService.getUserProfile(user.id);
  }
}
