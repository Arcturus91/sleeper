import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { cardDto } from './card.dto';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChargeDTO {
  @IsDefined() // guarantees the card property is not undefined.
  @IsNotEmptyObject()
  @ValidateNested() //means it will check the properties inside.
  @Type(() => cardDto)
  @Field()
  card: cardDto;

  @IsNumber()
  @Field()
  amount: number;
}
