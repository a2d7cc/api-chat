import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { RedisService, SharedService } from '@app/shared';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
export class PresenceController {
  constructor(
    private readonly rediseService: RedisService,
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
  ) {}

  @Get()
  getHello(): string {
    return this.presenceService.getHello();
  }

  @MessagePattern({ cmd: 'get-presence' })
  @UseInterceptors(CacheInterceptor)
  async getUser(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    const foo = await this.rediseService.get('foo');
    if (foo) {
      console.log('CACHED Foo');
      return foo;
    }

    const f = this.presenceService.getFoo();
    await this.rediseService.set('foo', f);
    return f;
  }
}
