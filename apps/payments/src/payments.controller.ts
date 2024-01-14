import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDTO } from '@app/common/dto/create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  async createCharge(@Payload() data: CreateChargeDTO) {
    this.paymentsService.createCharge(data);
  }
}

/* once we hace the service created, we want to expose it for other microservices. 
Remember we have the port only open for rpc communication, so there will be a message pattern needed here. 
A one that will call the microservice and return a confirmation or smthng.
*/
