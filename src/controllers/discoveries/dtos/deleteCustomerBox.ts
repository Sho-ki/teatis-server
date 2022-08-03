import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class DeleteCustomerBoxDto {
  @IsString()
    name: string;

  @IsString()
    subtotal_price: string;

  @IsObject()
    customer: { email: string, id: number };

  @IsArray()
    line_items: { product_id: number }[];

  @IsArray()
  @IsOptional()
    note_attributes?: { name: string, value: string }[];
}
