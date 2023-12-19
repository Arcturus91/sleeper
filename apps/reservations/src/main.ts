import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); //this is for not allowing other properties than the ones that are defined in the DTO
  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
