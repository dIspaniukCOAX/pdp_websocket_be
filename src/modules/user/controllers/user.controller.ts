import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Patch,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'decorators/user.decorator';
import { Request } from 'express';

import { UpdateUser } from '../entities/updateUser.entity';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller({ path: 'chat/user' })
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profiles')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  @ApiOkResponse({
    description: 'List of all users',
    type: [User],
  })
  @ApiBearerAuth()
  async getAllUsers(
    @Req() req: Request
  ) {
    const user: User = <User>req.user;

    return this.userService.getAllUsers(user.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('profile')
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Update current user profile using JWT token',
  })
  @ApiOkResponse({
    description: 'Updated user profile',
    type: () => User,
  })
  @ApiBearerAuth()
  async updateCurrentUser(
    @Req() req: Request,
    @Body() dto: UpdateUser,
    @GetUser() user: User,
  ) {
    return this.userService.updateUserById(user.id, dto);
  }
}
