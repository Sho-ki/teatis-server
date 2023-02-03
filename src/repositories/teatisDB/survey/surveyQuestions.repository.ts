import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { SURVEY_NAME } from '@Usecases/utils/surveyName';
import { ActiveSurvey, ChildSurveyQuestion, ParentSurveyQuestion, ParentSurveyQuestionWithoutOption } from '../../../domains/Survey';

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

    const allQuestions: ParentSurveyQuestion[]= [];

    const questions = response.intermediateSurveyQuestions;
    for (const question of questions) {
      if(question.surveyQuestion.responseType === 'multiple' || question.surveyQuestion.responseType === 'single'){
        const options = question.surveyQuestion.surveyQuestionOptions;
        delete question.surveyQuestion.surveyQuestionOptions;
        const surveyQuestion: ParentSurveyQuestion = {
          ...question.surveyQuestion,
          customerResponse: null,
          options,
        };
        allQuestions.push(surveyQuestion);
      }else{
        delete question.surveyQuestion.surveyQuestionOptions;
        const surveyQuestion: ParentSurveyQuestionWithoutOption =
         { ...question.surveyQuestion, options: undefined, customerResponse: null };

        allQuestions.push(surveyQuestion);
      }
    }

    delete response.intermediateSurveyQuestions;

    const parentChildMap = new Map<number, ChildSurveyQuestion[]>();

    for (const question of allQuestions) {
      if (question.parentSurveyQuestionId) {
        if (!parentChildMap.has(question.parentSurveyQuestionId)) {
          parentChildMap.set(question.parentSurveyQuestionId, []);
        }
        parentChildMap.get(question.parentSurveyQuestionId).push(question);
      }
    }

    const parentSurveyQuestions: ParentSurveyQuestion[] = [];
    for (const question of allQuestions) {
      if (!question.parentSurveyQuestionId) {

        question.children = parentChildMap.get(question.id) || [];
        parentSurveyQuestions.push(question);
      }
    }

    return [
      {
        surveyQuestions: parentSurveyQuestions,
        ...response,
      },
    ];
  }
}
