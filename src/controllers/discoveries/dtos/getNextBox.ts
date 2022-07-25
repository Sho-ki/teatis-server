import {  IsString } from 'class-validator';

export class GetNextBoxDto {
  @IsString()
  uuid: string;
}
