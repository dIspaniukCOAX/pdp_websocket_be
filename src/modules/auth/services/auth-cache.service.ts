import { Injectable } from '@nestjs/common';

import {
  SECONDS_IN_24_HOURS,
  SECONDS_IN_30_DAYS,
} from '../../../constants/time.constant';
import { CacheService } from '../../cache/services/cache.service';

@Injectable()
export class AuthCacheService {
  constructor(private readonly cacheService: CacheService) {}

  public async getUserIdByRefreshToken(refreshToken: string): Promise<string> {
    return this.cacheService.get(`refresh-${refreshToken}`);
  }

  public async setRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    await this.cacheService.set(`refresh-${refreshToken}`, userId, {
      ttl: SECONDS_IN_30_DAYS,
    });
  }

  public async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.cacheService.delete(`refresh-${refreshToken}`);
  }

  public async deletePasswordRecoveryTokenFromCache(
    token: string,
  ): Promise<void> {
    await this.cacheService.delete(`forgot-password-token-${token}`);
  }

  public async getUserIdByPasswordRecoveryTokenFromCache(
    token: string,
  ): Promise<number> {
    return this.cacheService.get(`forgot-password-token-${token}`);
  }

  public async setPasswordRecoveryTokenToCache(
    userId: number,
    token: string,
  ): Promise<void> {
    await this.cacheService.set(`forgot-password-token-${token}`, userId, {
      ttl: SECONDS_IN_24_HOURS,
    });
  }
}
