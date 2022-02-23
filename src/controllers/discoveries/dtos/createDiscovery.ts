import { IsString } from 'class-validator';

export class CreateDiscoveryInfoDto {
  @IsString()
  typeformId: string;
}
