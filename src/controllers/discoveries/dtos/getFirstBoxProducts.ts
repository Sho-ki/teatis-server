import { IsString } from 'class-validator';

export class GetFirstBoxProductsDto {
  @IsString()
  id: string;
}
