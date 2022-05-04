import { IsString } from 'class-validator';

export class GetCustomerNutritionDto {
  @IsString()
  uuid: string;
}
