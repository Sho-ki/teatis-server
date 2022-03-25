import { IsArray, IsObject, IsString } from 'class-validator';

export class UpdateCustomerOrderDto {
  @IsString()
  name: string;

  @IsObject()
  customer: { email: string; id: number };

  @IsArray()
  line_items: { product_id: number }[];
}
