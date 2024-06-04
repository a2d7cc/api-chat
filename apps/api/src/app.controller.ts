import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@app/shared';
import { NewUserDTO } from 'apps/auth/src/dtos/new-user.dto';
import { ExistingUserDTO } from 'apps/auth/src/dtos/existin-user.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  @Get('auth')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }

  @Post('auth')
  async postUser() {
    return this.authService.send(
      {
        cmd: 'post-user',
      },
      {},
    );
  }

  @UseGuards(AuthGuard)
  @Get('presence')
  async getPresence() {
    console.log('getPresence');
    return this.presenceService.send(
      {
        cmd: 'get-presence',
      },
      {},
    );
  }

  @Post('auth/register')
  async register(@Body() newUser: NewUserDTO) {
    console.log('I am in auth/register');
    console.log('firstName', newUser);
    const { firstName, lastName, email, password } = newUser;
    return this.authService.send(
      {
        cmd: 'register',
      },
      {
        firstName,
        lastName,
        email,
        password,
      },
    );
  }

  @Post('auth/login')
  async login(@Body() existingUser: ExistingUserDTO) {
    const { email, password } = existingUser;
    return this.authService.send(
      {
        cmd: 'login',
      },
      {
        email,
        password,
      },
    );
  }
}
