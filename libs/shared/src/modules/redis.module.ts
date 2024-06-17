import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CacheModule.register({
      max: 100,
      ttl: 0,
    }),
  ],
})
export class RedisModule {}
