import { IsEmail } from 'class-validator';

export class AnalyzeDiscoveryInfoDto {
  @IsEmail()
  email: string;
}
