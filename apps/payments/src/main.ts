import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: 'payments',
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  /*   await app.listen(configService.get('PORT')); 
  WE DONT need to listen http requests because Payments module will only have communication between services, not incoming http requests.
  */
}
bootstrap();
