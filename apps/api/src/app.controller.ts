import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private AuthService: ClientProxy,
  ) {}

  @Get()
  async getUser() {
    return this.AuthService.send(
      {
        cmd: 'get-user',
      },
      {},
    );
  }
}
