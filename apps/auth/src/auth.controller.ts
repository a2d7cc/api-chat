import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { NewUserDTO } from './dtos/new-user.dto';

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

  @MessagePattern({ cmd: 'register' })
  async register(@Ctx() context: RmqContext, @Payload() newUser: NewUserDTO) {
    this.sharedService.acknowledgeMessage(context);
    /*     const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message); */
    return this.authService.register(newUser);
  }

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }
}
