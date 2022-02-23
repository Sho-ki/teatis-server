import { Injectable } from '@nestjs/common';
import { Prisma, Discoveries, Customers, prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { SurveyQuestionIds } from '../../../domains/model/teatisDB/questionRepo/questionPostPurchaseSurvey';
import { SurveyQuestions } from '../../../domains/entity/surveyQuestions/surveyQuestions';

interface GetSurveyIdArgs {
  surveyName: string;
}

export interface GetSurveyIdRes {
  surveyId: number;
}

interface GetSurveyQuestionsArgs {
  surveyId: number;
}

export interface GetSurveyQuestionsRes {
  id: number;
  name: string;
  label: string;
  questionCategoryId: number;
  questionCategory: string;
  mustBeAnswered: boolean;
  instruction: string | null;
  placeholder: string | null;
  surveyQuestionAnswerTypeId: number;
  surveyQuestionAnswerType: string;
  surveyQuestionOptions: QuestionOptions[];
}

interface QuestionOptions {
  id: number;
  label: string;
}

export interface QuestionPostPurchaseSurveyRepoInterface {
  getSurveyId({ surveyName }: GetSurveyIdArgs): Promise<GetSurveyIdRes>;

  getSurveyQuestions({
    surveyId,
  }: GetSurveyQuestionsArgs): Promise<GetSurveyQuestionsRes[]>;
}

@Injectable()
export class QuestionPostPurchaseSurveyRepo
  implements QuestionPostPurchaseSurveyRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async getSurveyId({ surveyName }: GetSurveyIdArgs): Promise<GetSurveyIdRes> {
    const targetSurvey = await this.prisma.survey.findUnique({
      where: { name: surveyName },
    });
    return { surveyId: targetSurvey.id };
  }

  async findSurveyQuestionIds(surveyId: number): Promise<SurveyQuestionIds[]> {
    return await this.prisma.intermediateSurveyQuestion.findMany({
      where: { surveyId },
      orderBy: [{ order: 'asc' }],
      select: { surveyQuestionId: true },
    });
  }

  async getSurveyQuestions({
    surveyId,
  }: GetSurveyQuestionsArgs): Promise<GetSurveyQuestionsRes[]> {
    let surveQuestions = await this.prisma.surveyQuestion.findMany({
      where: {
        intermediateSurveyQuestion: { every: { surveyId } },
      },
      select: {
        id: true,
        name: true,
        label: true,
        questionCategoryId: true,
        questionCategory: {
          select: { label: true },
        },
        mustBeAnswered: true,
        instruction: true,
        placeholder: true,
        surveyQuestionAnswerTypeId: true,
        surveyQuestionAnswerType: { select: { label: true } },
        surveyQuestionOptions: {
          select: { label: true, id: true },
        },
      },
    });
    return surveQuestions.map((question) => {
      return {
        id: question.id,
        name: question.name,
        label: question.label,
        questionCategoryId: question.questionCategoryId,
        questionCategory: question.questionCategory.label,
        mustBeAnswered: question.mustBeAnswered,
        instruction: question.instruction,
        placeholder: question.placeholder,
        surveyQuestionAnswerTypeId: question.surveyQuestionAnswerTypeId,
        surveyQuestionAnswerType: question.surveyQuestionAnswerType.label,
        surveyQuestionOptions: question.surveyQuestionOptions,
      };
    });
  }
}
