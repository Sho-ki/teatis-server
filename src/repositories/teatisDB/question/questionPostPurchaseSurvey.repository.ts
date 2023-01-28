import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import {  SurveyWithActiveQuestions } from '../../../domains/Survey';
import { ActiveQuestion } from '../../../domains/SurveyQuestion';

interface GetSurveyWithActiveQuestionsArgs {
  surveyName: string;
}

export interface QuestionPostPurchaseSurveyRepositoryInterface {
  getSurveyWithActiveQuestions({ surveyName }: GetSurveyWithActiveQuestionsArgs):
  Promise<ReturnValueType<SurveyWithActiveQuestions>>;
}

@Injectable()
export class QuestionPostPurchaseSurveyRepository
implements QuestionPostPurchaseSurveyRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getSurveyWithActiveQuestions({ surveyName }: GetSurveyWithActiveQuestionsArgs):
  Promise<ReturnValueType<SurveyWithActiveQuestions>> {
    const response = await this.prisma.survey.findUnique({
      where: { name: surveyName },
      include: {
        intermediateSurveyQuestions: {
          where: { activeStatus: 'active' },
          include: { surveyQuestion: { include: { surveyQuestionOptions: true } } },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if(!response.intermediateSurveyQuestions.length){
      return [undefined, { name: 'NoQuestion', message: 'No questions were found' }];
    }
    const surveyQuestions: ActiveQuestion[] =
      response.intermediateSurveyQuestions.map(({ surveyQuestion }):ActiveQuestion => {
        return { ...surveyQuestion, options: surveyQuestion.surveyQuestionOptions }; });

    delete response.intermediateSurveyQuestions;
    return [{ ...response, surveyQuestions }];
  }
}
