import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheStore } from '@nestjs/common/cache';
import { ConfigService } from '@nestjs/config';
import redisStore from 'cache-manager-redis-store';

import { SECONDS_IN_7_DAYS } from '../../constants/time.constant';
import { CacheService } from './services/cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          store: redisStore as unknown as CacheStore,
          ttl: SECONDS_IN_7_DAYS,
          isGlobal: true,
          url: configService.get('REDIS_URL'),
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
