import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCustomerOrderDto {
  @IsString()
  name: string;

  @IsObject()
  customer: { email: string; orders_count: number };

  @IsArray()
  line_items: { product_id: number }[];
}
