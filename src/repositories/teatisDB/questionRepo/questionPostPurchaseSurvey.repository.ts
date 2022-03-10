import { Injectable } from '@nestjs/common';
import { Prisma, Discoveries, Customers, prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';

// interface GetSurveyIdArgs {
//   surveyName: string;
// }

// export interface GetSurveyIdRes {
//   surveyId: number;
// }

interface GetSurveyQuestionsArgs {
  surveyName: string;
}

export interface GetSurveyQuestionsRes {
  id: number;
  name: string;
  labal: string;
  surveyQuestions: GetSurveyQuestionsResElement[];
}

interface GetSurveyQuestionsResElement {
  id: number;
  name: string;
  label: string;
  order?: number;
  questionCategory: { id: number; name: string; label: string };
  mustBeAnswered: boolean;
  instruction?: string;
  placeholder?: string;
  surveyQuestionAnswerType: { id: number; name: string; label: string };
  surveyQuestionOptions?: { id: number; name: string; label: string }[];
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
        intermediateSurveyQuestion: {
          select: {
            order: true,
            surveyQuestion: {
              select: {
                id: true,
                name: true,
                label: true,
                questionCategoryId: true,
                questionCategory: {
                  select: { label: true, name: true },
                },
                mustBeAnswered: true,
                instruction: true,
                placeholder: true,
                surveyQuestionAnswerTypeId: true,
                surveyQuestionAnswerType: {
                  select: { name: true, label: true },
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
    let surveyQuestions: GetSurveyQuestionsResElement[] = [];
    for (let question of getSurveQuestionsRes.intermediateSurveyQuestion) {
      let surveyQuestion: GetSurveyQuestionsResElement = {
        id: question.surveyQuestion.id,
        name: question.surveyQuestion.name,
        label: question.surveyQuestion.label,
        order: question.order,
        questionCategory: {
          id: question.surveyQuestion.questionCategoryId,
          name: question.surveyQuestion.questionCategory.name,
          label: question.surveyQuestion.questionCategory.label,
        },
        mustBeAnswered: question.surveyQuestion.mustBeAnswered,
        instruction: question.surveyQuestion.instruction,
        placeholder: question.surveyQuestion.placeholder,
        surveyQuestionAnswerType: {
          id: question.surveyQuestion.surveyQuestionAnswerTypeId,
          name: question.surveyQuestion.surveyQuestionAnswerType.name,
          label: question.surveyQuestion.surveyQuestionAnswerType.label,
        },
        surveyQuestionOptions: question.surveyQuestion.surveyQuestionOptions,
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

  // async getSurveyQuestions({
  //   surveyId,
  // }: GetSurveyQuestionsArgs): Promise<GetSurveyQuestionsRes[]> {
  //   let surveQuestions = await this.prisma.surveyQuestion.findMany({
  //     where: {
  //       intermediateSurveyQuestion: { every: { surveyId } },
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       label: true,
  //       questionCategoryId: true,
  //       questionCategory: {
  //         select: { label: true, name: true },
  //       },
  //       mustBeAnswered: true,
  //       instruction: true,
  //       placeholder: true,
  //       surveyQuestionAnswerTypeId: true,
  //       surveyQuestionAnswerType: { select: { name: true, label: true } },
  //       surveyQuestionOptions: {
  //         select: { label: true, id: true, name: true },
  //       },
  //     },
  //   });
  //   return surveQuestions.map((question) => {
  //     return {
  //       id: question.id,
  //       name: question.name,
  //       label: question.label,
  //       questionCategory: {
  //         id: question.questionCategoryId,
  //         name: question.questionCategory.name,
  //         label: question.questionCategory.label,
  //       },
  //       mustBeAnswered: question.mustBeAnswered,
  //       instruction: question.instruction,
  //       placeholder: question.placeholder,
  //       surveyQuestionAnswerType: {
  //         id: question.surveyQuestionAnswerTypeId,
  //         name: question.surveyQuestionAnswerType.name,
  //         label: question.surveyQuestionAnswerType.label,
  //       },
  //       surveyQuestionOptions: question.surveyQuestionOptions,
  //     };
  //   });
  // }
}
