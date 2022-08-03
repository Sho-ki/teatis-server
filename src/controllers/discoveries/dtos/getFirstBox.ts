import { IsString } from 'class-validator';

export class GetFirstBoxDto {
  @IsString()
    uuid: string;
}
