import { IsString } from 'class-validator';

export class CreateUserInfoDto {
  @IsString()
  userResponseId: string;
}
