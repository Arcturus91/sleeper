import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentCreateChargeDto } from './dto/payments-create-charge.dto';
import {
  PaymentsServiceController,
  PaymentsServiceControllerMethods,
} from '@app/common';

@Controller()
@PaymentsServiceControllerMethods()
export class PaymentsController implements PaymentsServiceController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UsePipes(new ValidationPipe()) //validation pipe checks if data complies with DTO and returns an error if not.
  async createCharge(data: PaymentCreateChargeDto) {
    //if i d only have the dto, remember thats only typing. If am not using pipes, i d pass properties as undefined and will not have control at runtime
    //also, wrong data would reach my controller and service which can lead to unpredictable value
    return this.paymentsService.createCharge(data);
  }
}

/* once we hace the service created, we want to expose it for other microservices. 
Remember we have the port only open for rpc communication, so there will be a message pattern needed here. 
A one that will call the microservice and return a confirmation or smthng.
*/
