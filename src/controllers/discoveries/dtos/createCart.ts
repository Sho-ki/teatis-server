import { IsEmail, IsString } from 'class-validator';

export class CreateCartDto {
  @IsEmail()
  email: string;

  @IsString()
  merchandiseId: string;

  @IsString()
  sellingPlanId: string;

  @IsString()
  uuid: string;
}
