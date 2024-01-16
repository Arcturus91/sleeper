import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe()) //validation pipe checks if data complies with DTO and returns an error if not.
  async createCharge(
    @Payload() data: PaymentCreateChargeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
    //when we ack the message (acknowledge), reabbitmq delete the message from the queue, so its not sent anymore.

    //if i d only have the dto, remember thats only typing. If am not using pipes, i d pass properties as undefined and will not have control at runtime
    //also, wrong data would reach my controller and service which can lead to unpredictable value
    return this.paymentsService.createCharge(data);
  }
}

/* once we hace the service created, we want to expose it for other microservices. 
Remember we have the port only open for rpc communication, so there will be a message pattern needed here. 
A one that will call the microservice and return a confirmation or smthng.
*/
