import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { ActiveSurvey } from '@Domains/Survey';
import { SURVEY_NAME } from '@Usecases/utils/surveyName';
import {  ActiveQuestionWithOptions, ActiveQuestionWithoutOptions  } from '../../../domains/SurveyQuestion';

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

    const questionsWithOptions: ActiveQuestionWithOptions[]= [];
    const questionsWithoutOptions:ActiveQuestionWithoutOptions[] = [];

    const questions = response.intermediateSurveyQuestions;
    for (const question of questions) {
      if(question.surveyQuestion.responseType === 'multiple' || question.surveyQuestion.responseType === 'single'){
        const options = question.surveyQuestion.surveyQuestionOptions;
        delete question.surveyQuestion.surveyQuestionOptions;
        const surveyQuestion: ActiveQuestionWithOptions = {
          ...question.surveyQuestion,
          options,
        };
        questionsWithOptions.push(surveyQuestion);
      }else{
        delete question.surveyQuestion.surveyQuestionOptions;
        const surveyQuestion: ActiveQuestionWithoutOptions = { ...question.surveyQuestion, options: undefined };

        questionsWithoutOptions.push(surveyQuestion);
      }
    }

    delete response.intermediateSurveyQuestions;

    return [{ surveyQuestions: { ...questionsWithoutOptions, ...questionsWithOptions }, ...response }];
  }
}
