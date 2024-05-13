import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CardDto } from './card.dto';
import { Type } from 'class-transformer';
import { CreateChargeMessage } from '../types';

export class CreateChargeDTO implements Omit<CreateChargeMessage, 'email'> {
  @IsDefined() // guarantees the card property is not undefined.
  @IsNotEmptyObject()
  @ValidateNested() //means it will check the properties inside.
  @Type(() => CardDto)
  card: CardDto;

  @IsNumber()
  amount: number;
}
