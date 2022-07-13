import { Injectable } from '@nestjs/common';
import { Question } from '@Domains/Question';
import { SurveyQuestion } from '@Domains/SurveyQuestion';
import { PrismaService } from '../../../prisma.service';

interface GetSurveyQuestionsArgs {
  surveyName: string;
}

export interface QuestionPostPurchaseSurveyRepositoryInterface {
  getSurveyQuestions({
    surveyName,
  }: GetSurveyQuestionsArgs): Promise<[SurveyQuestion?, Error?]>;
}

@Injectable()
export class QuestionPostPurchaseSurveyRepository
  implements QuestionPostPurchaseSurveyRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getSurveyQuestions({
    surveyName,
  }: GetSurveyQuestionsArgs): Promise<[SurveyQuestion?, Error?]> {
    try {
      const response = await this.prisma.survey.findUnique({
        where: { name: surveyName },
        select: {
          id: true,
          name: true,
          label: true,
          intermediateSurveyQuestions: {
            orderBy: { displayOrder: 'asc' },
            select: {
              surveyQuestion: {
                select: {
                  id: true,
                  name: true,
                  label: true,
                  questionCategory: {
                    select: { name: true },
                  },
                  mustBeAnswered: true,
                  instruction: true,
                  placeholder: true,
                  surveyQuestionAnswerType: {
                    select: { name: true },
                  },
                  surveyQuestionOptions: {
                    select: { label: true, id: true, name: true },
                  },
                },
              },
            },
          },
        },
      });
      let surveyQuestions: Question[] = [];
      for (let question of response?.intermediateSurveyQuestions || []) {
        let surveyQuestion: Question = {
          id: question.surveyQuestion.id,
          name: question.surveyQuestion.name,
          label: question.surveyQuestion.label,
          mustBeAnswered: question.surveyQuestion.mustBeAnswered,
          instruction: question.surveyQuestion.instruction || '',
          placeholder: question.surveyQuestion.placeholder || '',
          answerType: question.surveyQuestion.surveyQuestionAnswerType.name,

          options: question.surveyQuestion.surveyQuestionOptions,
        };
        surveyQuestions.push(surveyQuestion);
      }

      const { id, name, label } = response as {
        id: number;
        name: string;
        label: string;
      };
      if (!id || !name || !label) {
        throw new Error();
      }
      return [
        {
          id,
          name,
          label,
          surveyQuestions,
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getSurveyQuestions failed',
        },
      ];
    }
  }
}