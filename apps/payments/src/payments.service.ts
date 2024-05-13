import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient;
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  async createCharge({ card, amount, email }: PaymentCreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        cvc: card.cvc,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        number: card.number,
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // this is for getting the dollar amount
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      currency: 'usd',
      confirm: true,
      payment_method: paymentMethod.id,
    });
    const textSuccess = `Payment of $${amount} has been completed successfully`;

    if (!this.notificationsService) {
      this.notificationsService =
        this.client.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME,
        );
    }
    this.notificationsService
      .notifyEmail({
        email,
        text: textSuccess,
      })
      .subscribe(() => {});
    return paymentIntent;
  }
}

//nota como en el servicio que queremos emitir, registramos el cliente para indicar que ese es el que nos va a escuchar
//indicamos el cliente en el modulo y en el servicio, llamamos a dicho cliente como clientProxy y lo hacemos emitir un evento llevando info.
//el evento es escuchado por el controlador qe está escuchando el message pattern o event pattern
// nota la diferencia entre emit y send.
