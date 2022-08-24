import { IsArray } from 'class-validator';

export class UpdateRecurringPractitionerBoxDto {
  @IsArray()
    products: { sku: string } [];
}
