import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUser(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    /*     const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message); */

    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'post-user' })
  async postUser(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    /*     const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message); */

    return this.authService.postUser();
  }

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }
}
