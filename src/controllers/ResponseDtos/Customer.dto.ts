import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CustomerDto {
  @Expose()
    id: number;

  @Expose()
    uuid: string;

  @Expose()
  @IsOptional()
    firstName?: string;

  @Expose()
  @IsOptional()
    lastName?: string;
}
