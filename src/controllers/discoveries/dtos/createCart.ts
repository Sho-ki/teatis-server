import { IsEmail, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  merchandiseId: string;

  @IsString()
  sellingPlanId: string;

  @IsString()
  uuid: string;
}
