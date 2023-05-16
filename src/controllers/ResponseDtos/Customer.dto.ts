import { CustomerType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class CustomerDto {
  @Expose()
    id: number;

  @Expose()
    uuid: string;

  @Expose()
    email: string;

  @Expose()
  @IsEnum(CustomerType)
    customerType: CustomerType;

  @Expose()
  @IsOptional()
    phone?: string;

  @Expose()
  @IsOptional()
    firstName?: string;

  @Expose()
  @IsOptional()
    lastName?: string;
}
