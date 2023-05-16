import { IsString } from 'class-validator';

export class GetCustomerDeviceRequestDto {
  @IsString()
    uuid: string;
}
