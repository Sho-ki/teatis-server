import { IsString } from 'class-validator';

export class CreateCustomerInfoDto {
  @IsString()
  typeformId: string;
}
