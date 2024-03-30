import { Controller, Get } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { AuthGuard } from '@app/shared';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
    // TEMP
    private readonly authGuard: AuthGuard,
  ) {}

  @Get()
  getHello(): string {
    return this.presenceService.getHello();
  }

  @MessagePattern({ cmd: 'get-presence' })
  async getUser(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    console.log('jwt', this.authGuard.hasJWT());

    return this.presenceService.getHello();
  }
}
