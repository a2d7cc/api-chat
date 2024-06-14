import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  SharedModule,
  PostgresDBModule,
  SharedService,
  UserEntity,
} from '@app/shared';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { UsersRepository } from '@app/shared/repositories/users.repository';
import { FriendRequestRepository } from '@app/shared/repositories/friend-request.repository';
import { FriendRequestEntity } from '@app/shared/entities/friend-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    SharedModule,
    PostgresDBModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),

    /*     TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URI'),
        autoLoadEntities: true,
        synchronize: true, // should not be used in production - may lose data
        entities: [UserEntity],
      }),
      inject: [ConfigService],
    }), */

    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([FriendRequestEntity]),
  ],
  controllers: [AuthController],
  providers: [
    JwtGuard,
    JwtStrategy,
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
    {
      provide: 'FriendRequestRepositoryInterface',
      useClass: FriendRequestRepository,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class AuthModule {}
