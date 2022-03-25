import { IsEmail } from 'class-validator';

export class GetNextBoxSurveyDto {
  @IsEmail()
  email: string;
}
