import { IsArray, IsOptional, IsString } from 'class-validator';

export class PostWeeklyCheckInDto {
  @IsString()
    uuid: string;

  @IsString()
  @IsOptional()
    pointToken?: string;

  @IsArray()
    customerResponses: {
      surveyQuestionId: number;
      response?: number;
    }[];
}
