import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard {
  hasJWT() {
    return {
      jwt: 'token',
    };
  }
}
