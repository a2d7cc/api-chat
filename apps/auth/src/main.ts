import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_AUTH_QUEUE');
  app.connectMicroservice(sharedService.getRmqOptions(queue));

  /*   const USER = configService.get('RABBITMQ_USER');
  const PASS = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASS}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  }); */

  app.startAllMicroservices();
}
bootstrap();
