import { IsString } from 'class-validator';

export class CreateUserInfoDto {
  @IsString()
  typeformUserId: string;
}
