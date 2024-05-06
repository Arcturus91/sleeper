import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT_TCP: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
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
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST'),
            port: configService.get('NOTIFICATIONS_PORT'),
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
