import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  async createCharge({ amount, email }: PaymentCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // this is for getting the dollar amount
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      currency: 'usd',
      confirm: true,
      payment_method: 'pm_card_visa',
    });
    const textSuccess = `Payment of $${amount} has been completed successfully`;
    this.notificationsService.emit('notify_email', {
      email,
      text: textSuccess,
    });
    return paymentIntent;
  }

  async getPayments() {
    const allPayments = await this.stripe.paymentIntents.list();
    return allPayments.data;
  }
}

//nota como en el servicio que queremos emitir, registramos el cliente para indicar que ese es el que nos va a escuchar
//indicamos el cliente en el modulo y en el servicio, llamamos a dicho cliente como clientProxy y lo hacemos emitir un evento llevando info.
//el evento es escuchado por el controlador qe está escuchando el message pattern o event pattern
// nota la diferencia entre emit y send.
