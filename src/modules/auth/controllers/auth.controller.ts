import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';

import { PublicRoute } from '../../../decorators/public-route.decorator';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { GoogleAuthDto } from '../dto/google-auth.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterDto } from '../dto/register.dto';
import { SetNewPasswordDto } from '../dto/set-new-password.dto';
import { UserTokenDto } from '../dto/user-token.dto';
import { AuthService } from '../services/auth.service';
import { GoogleStrategy } from '../strategies/google.strategy';

@ApiTags('auth')
@Controller({ path: 'host/auth' })
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @PublicRoute()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @ApiOperation({
    summary: 'Register',
    description: 'Register a new user',
  })
  @ApiOkResponse({
    description: 'User successfully registered',
    type: UserTokenDto,
  })
  register(@Body() body: RegisterDto): Promise<UserTokenDto> {
    return this.authService.register(body);
  }

  @PublicRoute()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'Log in a user',
  })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: UserTokenDto,
  })
  login(@Body() body: LoginDto): Promise<UserTokenDto> {
    return this.authService.login(body);
  }

  @PublicRoute()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh the authentication token',
  })
  @ApiOkResponse({
    description: 'Token successfully refreshed',
    type: UserTokenDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  public async refresh(@Body() dto: RefreshTokenDto): Promise<UserTokenDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  @PublicRoute()
  @Post('google')
  @ApiOperation({
    summary: 'Google auth',
    description: 'Authenticate with Google',
  })
  @ApiOkResponse({
    description: 'Token successfully refreshed',
    type: UserTokenDto,
  })
  async authWithGoogle(@Body() params: GoogleAuthDto): Promise<UserTokenDto> {
    return this.authService.signWithGoogle(
      params.authorizationCode,
      new GoogleStrategy(this.i18n),
    );
  }

  @PublicRoute()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: 'Send password recovery link',
  })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  @ApiNoContentResponse({
    description: 'Password recovery link successfully sent',
  })
  public async sendPasswordRecoveryLink(
    @Body() dto: ForgotPasswordDto,
  ): Promise<void> {
    await this.authService.sendPasswordRecoveryLink(dto);
  }

  @PublicRoute()
  @Patch('verify-forgot-token/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: 'Verify forgot password token',
  })
  @ApiBadRequestResponse({ description: 'Token is invalid' })
  @ApiNoContentResponse({ description: 'Token verified successfully' })
  public async verifyForgotToken(@Param('token') token: string): Promise<void> {
    await this.authService.verifyForgotToken(token);
  }

  @PublicRoute()
  @Patch('set-new-password/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: 'Set new user password',
  })
  @ApiBadRequestResponse({ description: 'Forgot password token is invalid' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  @ApiNoContentResponse({ description: 'Password updated successfully' })
  public async setNewPassword(
    @Param('token') token: string,
    @Body() dto: SetNewPasswordDto,
  ): Promise<void> {
    await this.authService.setNewPassword(dto, token);
  }

  @PublicRoute()
  @Post('resend-forgot-password/:token')
  @ApiOperation({
    description: 'Resend link for reset password',
  })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  public async resendForgotPasswordLink(
    @Param('token') token: string,
  ): Promise<void> {
    await this.authService.resendForgotPasswordLink(token);
  }
}
