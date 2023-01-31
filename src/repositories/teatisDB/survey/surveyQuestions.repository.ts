import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { ActiveSurvey } from '@Domains/Survey';
import { ActiveQuestion } from '@Domains/SurveyQuestion';
import { SURVEY_NAME } from '@Usecases/utils/surveyName';

interface GetSurveyQuestionsArgs {
  surveyName: SURVEY_NAME;
}

export interface SurveyQuestionsRepositoryInterface {
  getSurveyQuestions({ surveyName }: GetSurveyQuestionsArgs): Promise<ReturnValueType<ActiveSurvey>>;
}

@Injectable()
export class SurveyQuestionsRepository
implements SurveyQuestionsRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getSurveyQuestions({ surveyName }: GetSurveyQuestionsArgs): Promise<ReturnValueType<ActiveSurvey>> {
    const response = await this.prisma.survey.findUnique({
      where: { name: surveyName },
      include: {
        intermediateSurveyQuestions: {
          where: { isArchived: false },
          orderBy: { displayOrder: 'asc' },
          include: { surveyQuestion: { include: { surveyQuestionOptions: { where: { isArchived: false } } } } },
        },
      },
    });

    if(!response){
      return [undefined, { name: 'InvalidSurveyName', message: 'Survey name is invalid' }];
    }
    if(!response.intermediateSurveyQuestions.length){
      return [undefined, { name: 'NoQuestions', message: 'No questions were found.' }];
    }

    const surveyQuestions: ActiveQuestion[] = [];

    for (const question of response.intermediateSurveyQuestions) {
      const surveyQuestion: ActiveQuestion = {
        ...question.surveyQuestion,
        options: question.surveyQuestion.surveyQuestionOptions,
      };
      delete question.surveyQuestion.surveyQuestionOptions;
      surveyQuestions.push(surveyQuestion);
    }

    delete response.intermediateSurveyQuestions;

    return [{ surveyQuestions, ...response }];
  }
}
