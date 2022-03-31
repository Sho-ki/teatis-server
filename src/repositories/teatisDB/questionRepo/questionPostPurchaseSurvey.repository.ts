import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

interface GetSurveyQuestionsArgs {
  surveyName: string;
}

interface GetSurveyQuestionsRes {
  id: number;
  name: string;
  labal: string;
  surveyQuestions: GetSurveyQuestionsResSurveyQuestion[];
}

interface GetSurveyQuestionsResSurveyQuestion {
  id: number;
  name: string;
  label: string;
  mustBeAnswered: boolean;
  instruction?: string;
  placeholder?: string;
  answerType: string;
  options?: { id: number; name: string; label: string }[];
}

export interface QuestionPostPurchaseSurveyRepoInterface {
  getSurveyQuestions({
    surveyName,
  }: GetSurveyQuestionsArgs): Promise<[GetSurveyQuestionsRes, Error]>;
}

@Injectable()
export class QuestionPostPurchaseSurveyRepo
  implements QuestionPostPurchaseSurveyRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async getSurveyQuestions({
    surveyName,
  }: GetSurveyQuestionsArgs): Promise<[GetSurveyQuestionsRes, Error]> {
    const getSurveQuestionsRes = await this.prisma.survey.findUnique({
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
    let surveyQuestions: GetSurveyQuestionsResSurveyQuestion[] = [];
    for (let question of getSurveQuestionsRes.intermediateSurveyQuestions) {
      let surveyQuestion: GetSurveyQuestionsResSurveyQuestion = {
        id: question.surveyQuestion.id,
        name: question.surveyQuestion.name,
        label: question.surveyQuestion.label,
        mustBeAnswered: question.surveyQuestion.mustBeAnswered,
        instruction: question.surveyQuestion.instruction,
        placeholder: question.surveyQuestion.placeholder,
        answerType: question.surveyQuestion.surveyQuestionAnswerType.name,

        options: question.surveyQuestion.surveyQuestionOptions,
      };
      surveyQuestions.push(surveyQuestion);
    }
    return [
      {
        id: getSurveQuestionsRes.id,
        name: getSurveQuestionsRes.name,
        labal: getSurveQuestionsRes.label,
        surveyQuestions,
      },
      null,
    ];
  }
}
