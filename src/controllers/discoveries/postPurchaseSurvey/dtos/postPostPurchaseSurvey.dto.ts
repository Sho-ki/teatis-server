import {  IsNumber, IsOptional } from 'class-validator';

export class CreateCheckoutCartDto {
  @IsNumber()
  @IsOptional()
    deliveryInterval?: 1 | 3 | 6 | 12;
}

