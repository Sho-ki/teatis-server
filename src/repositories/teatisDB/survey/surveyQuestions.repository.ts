import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { ActiveSurvey } from '@Domains/Survey';
import { SURVEY_NAME } from '@Usecases/utils/surveyName';
import { ActiveQuestion  } from '../../../domains/SurveyQuestion';

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

    const questions = response.intermediateSurveyQuestions;
    for (const question of questions) {
      if(question.surveyQuestion.responseType === 'multiple' || question.surveyQuestion.responseType === 'single'){
        const options = question.surveyQuestion.surveyQuestionOptions;
        delete question.surveyQuestion.surveyQuestionOptions;
        const surveyQuestion: ActiveQuestion = {
          ...question.surveyQuestion,
          options,
        };
        surveyQuestions.push(surveyQuestion);
      }else{
        delete question.surveyQuestion.surveyQuestionOptions;
        const surveyQuestion: ActiveQuestion = { ...question.surveyQuestion };

        surveyQuestions.push(surveyQuestion);
      }
    }

    delete response.intermediateSurveyQuestions;

    return [{ surveyQuestions, ...response }];
  }
}
