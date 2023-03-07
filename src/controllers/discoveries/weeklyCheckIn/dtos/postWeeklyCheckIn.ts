import { IsArray, IsString } from 'class-validator';

export class PostWeeklyCheckInDto {
    @IsString()
      uuid: string;

    @IsArray()
      customerResponses: {
      surveyQuestionId: number;
      response?: number;
    }[];
}
