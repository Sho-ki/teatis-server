import { IsEmail, IsString } from 'class-validator';

export class CreateOrderTaskDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  created_at: string;
}
