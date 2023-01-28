import { Injectable } from '@nestjs/common';
import { Question } from '@Domains/Question';
import { SurveyQuestion } from '@Domains/SurveyQuestion';
import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';

interface GetSurveyQuestionsArgs {
  surveyName: string;
}

export interface QuestionPostPurchaseSurveyRepositoryInterface {
  getSurveyQuestions({ surveyName }: GetSurveyQuestionsArgs): Promise<ReturnValueType<SurveyQuestion>>;
}

@Injectable()
export class QuestionPostPurchaseSurveyRepository
implements QuestionPostPurchaseSurveyRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getSurveyQuestions({ surveyName }: GetSurveyQuestionsArgs): Promise<ReturnValueType<SurveyQuestion>> {
    const response = await this.prisma.survey.findUnique({
      where: { name: surveyName },
      select: {
        id: true,
        name: true,
        label: true,
        intermediateSurveyQuestions: {
          where: { surveyQuestion: { activeStatus: 'active' } },
          select: {
            surveyQuestion: {
              select: {
                id: true,
                name: true,
                label: true,
                questionCategory: { select: { name: true } },
                mustBeAnswered: true,
                instruction: true,
                placeholder: true,
                surveyQuestionAnswerType: { select: { name: true } },
                surveyQuestionOptions: { select: { label: true, id: true, name: true } },
              },
            },
          },
        },
      },
    });
    const surveyQuestions: Question[] = [];
    for (const question of response?.intermediateSurveyQuestions || []) {
      const surveyQuestion: Question = {
        id: question.surveyQuestion.id,
        name: question.surveyQuestion.name,
        label: question.surveyQuestion.label,
        mustBeAnswered: question.surveyQuestion.mustBeAnswered,
        instruction: question.surveyQuestion.instruction || '',
        placeholder: question.surveyQuestion.placeholder || '',
        // answerType: question.surveyQuestion.surveyQuestionAnswerType.name,
        options: question.surveyQuestion.surveyQuestionOptions,
      };
      surveyQuestions.push(surveyQuestion);
    }

    const { id, name, label } = response as {
      id: number;
      name: string;
      label: string;
    };

    return [
      {
        id,
        name,
        label,
        surveyQuestions,
      },
    ];
  }
}
