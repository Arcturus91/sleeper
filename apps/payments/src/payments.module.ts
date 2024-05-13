import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import {
  LoggerModule,
  NOTIFICATIONS_PACKAGE_NAME,
  NOTIFICATIONS_SERVICE_NAME,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    //useFactory is for creating a provider instance using a custom factory function
    //instead of directly using a class constructor, probably reducing circular dependencies.
    /* 
    factory functions returns instances of other classes or objects. 
    if you inject a dependency class, you can use it as an input or make it available
     in the factory function instance context
    */
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: NOTIFICATIONS_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/notifications.proto'),
            url: configService.getOrThrow('NOTIFICATIONS_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
        /* The inject: [ConfigService] array specifies that the configService instance 
        should be made available within the factory function.
        The dependency injection framework handles this, providing the necessary instance
         when the factory is executed. */
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}

/* 
you need to import and register ConfigModule.forRoot at the module level to
 leverage ConfigService as an injectable dependency in your services.
 */
