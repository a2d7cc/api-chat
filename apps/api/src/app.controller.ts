import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private AuthService: ClientProxy,
  ) {}

  @Get('auth')
  async getUsers() {
    return this.AuthService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }

  @Post('auth')
  async postUser() {
    return this.AuthService.send(
      {
        cmd: 'post-user',
      },
      {},
    );
  }
}
