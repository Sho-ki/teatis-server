import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class GetCoachCustomersDto {
  @IsString()
    Location:'GetCustomerDetailsByCustomerId' | 'GetCustomersList';

  @ValidateIf(obj => obj.Location === 'GetCustomerDetailsByCustomerId')
  @IsNotEmpty()
  @IsString()
    CustomerId: string;

  @ValidateIf(obj => obj.Location === 'GetCustomersList')
  @IsNotEmpty()
  @IsString()
    PageSize: string;

  @ValidateIf(obj => obj.Location === 'GetCustomersList')
  @IsOptional()
  @IsString()
    Anchor?: string;

  @IsString()
    Worker: string;

}

