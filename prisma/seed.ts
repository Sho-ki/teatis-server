import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const customerNutritionItems = [
    {
      description: 'BMR',
      label: 'BMR',
    },
    {
      description: 'carbs_macronutrients',
      label: 'carbs_macronutrients',
    },
    {
      description: 'protein_macronutrients',
      label: 'protein_macronutrients',
    },
    {
      description: 'fat_macronutrients',
      label: 'fat_macronutrients',
    },
    {
      description: 'carbs_per_meal',
      label: 'carbs_per_meal',
    },
    {
      description: 'protein_per_meal',
      label: 'protein_per_meal',
    },
    {
      description: 'fat_per_meal',
      label: 'fat_per_meal',
    },
    {
      description: 'calorie_per_meal',
      label: 'calorie_per_meal',
    },
  ];

  for (let customerNutritionItem of customerNutritionItems) {
    await prisma.customerNutritionNeed.upsert({
      where: { label: customerNutritionItem.label },
      update: {},
      create: {
        label: customerNutritionItem.label,
        description: customerNutritionItem.description,
      },
    });
  }

  const surveyCreationItems = [
    // {
    //   surveyName: 'post-purchase',
    //   question: {
    //     order: 1,
    //     label: 'How would you feel if you could no longer use our service?',
    //     name: 'ifNoLongerAvailable',
    //     mustBeAnswered: true,
    //     category: 'serviceFeedback',
    //     answerType: 'singleAnswer',
    //     options: [
    //       'Not disappointed',
    //       'Somewhat disappointed',
    //       'Very disppointed',
    //     ],
    //   },
    // },
    // {
    //   surveyName: 'post-purchase',
    //   order: 2,
    //   question: {
    //     label:
    //       'What would you likely use as an alternative if our services were no longer available?',
    //     name: 'alternativeService',
    //     mustBeAnswered: false,
    //     category: 'serviceFeedback',
    //     placeHolder: 'Any other services come to mind?',
    //     answerType: 'text',
    //   },
    // },
    // {
    //   surveyName: 'post-purchase',
    //   question: {
    //     label: 'Hove you recommended our service to anyone?',
    //     name: 'haveRecommended',
    //     mustBeAnswered: false,
    //     category: 'serviceFeedback',
    //     answerType: 'singleAnswer',
    //     options: ['Yes', 'No'],
    //   },
    // },
    // {
    //   surveyName: 'post-purchase',
    //   question: {
    //     label: 'What is the main benefit you received from our service?',
    //     name: 'mainBenefitReceived',
    //     mustBeAnswered: true,
    //     category: 'serviceFeedback',
    //     answerType: 'text',
    //     instruction: 'List as many as you can, separated by commas.',
    //   },
    // },
    // {
    //   surveyName: 'post-purchase',
    //   question: {
    //     label: 'How can we improve our service to better meet your needs?',
    //     name: 'improvablePoint',
    //     mustBeAnswered: true,
    //     category: 'serviceFeedback',
    //     answerType: 'text',
    //     instruction: 'List as many as you can, separated by commas.',
    //   },
    // },
    {
      surveyName: 'post-purchase',
      question: {
        label: 'How satisfied are you with PRODUCT_NAME?',
        name: 'productSatisfaction',
        mustBeAnswered: false,
        category: 'productFeedback',
        answerType: 'numeric',
      },
    },
  ];

  for (let surveyCreationItem of surveyCreationItems) {
    const surveyQuery = await prisma.survey.upsert({
      where: { name: surveyCreationItem.surveyName },
      create: { name: surveyCreationItem.surveyName },
      update: {},
    });

    const questionQuery = await prisma.surveyQuestion.upsert({
      where: { name: surveyCreationItem.question.name },
      create: {
        label: surveyCreationItem.question.label,
        name: surveyCreationItem.question.name,
        mustBeAnswered: surveyCreationItem.question.mustBeAnswered,
        questionCategory: {
          connectOrCreate: {
            where: { label: surveyCreationItem.question.category },
            create: { label: surveyCreationItem.question.category },
          },
        },
        surveyQuestionOptions: {},
        surveyQuestionAnswerType: {
          connectOrCreate: {
            where: { label: surveyCreationItem.question.answerType },
            create: { label: surveyCreationItem.question.answerType },
          },
        },
      },
      update: {},
    });
    if (surveyCreationItem.question['options']) {
      for (let option of surveyCreationItem.question['options']) {
        await prisma.surveyQuestionOption.upsert({
          where: {
            QuestionOptionIdentifier: {
              surveyQuestionId: questionQuery.id,
              label: option,
            },
          },
          create: { surveyQuestionId: questionQuery.id, label: option },
          update: {},
        });
      }
    }
    await prisma.intermediateSurveyQuestion.upsert({
      where: {
        surveyId_surveyQuestionId: {
          surveyId: surveyQuery.id,
          surveyQuestionId: questionQuery.id,
        },
      },
      create: {
        surveyId: surveyQuery.id,
        surveyQuestionId: questionQuery.id,
      },
      update: {},
    });
  }

  const productPoviders = [{ provider: 'shiphero' }];

  for (let productPovider of productPoviders) {
    await prisma.productPovider.upsert({
      where: { provider: productPovider.provider },
      update: {},
      create: {
        provider: productPovider.provider,
      },
    });
  }
  //   const customerProductPrefQuestions = [
  //     {
  //       description: 'delivered last time',
  //       label: 'delivered_last_time',
  //       index_id: 1,
  //     },
  //     {
  //       description: 'must deliver next time',
  //       label: 'is_must',
  //       index_id: 2,
  //     },
  //     {
  //       description: 'dislike by preference',
  //       label: 'is_bad_evaluation',
  //       index_id: 3,
  //     },
  //     {
  //       description: 'dislike by allergy',
  //       label: 'have_allergy',
  //       index_id: 4,
  //     },
  //   ];

  //   for (let customerProductPrefQuestion of customerProductPrefQuestions) {
  //     await prisma.customerProductPrefQuestion.upsert({
  //       where: { label: customerProductPrefQuestion.label },
  //       update: {},
  //       create: {
  //         description: customerProductPrefQuestion.description,
  //         label: customerProductPrefQuestion.label,
  //         index_id: customerProductPrefQuestion.index_id,
  //       },
  //     });
  //   }

  //   const feedbackQuestions = [
  //     {
  //       question:
  //         'What would you likely use as an alternative if our service were no longer available?',
  //       label: 'alternativeService',
  //       is_active: true,
  //       required: true,
  //     },
  //     {
  //       question: 'Hove you recommended our service to anyone?',
  //       label: 'haveRecommended',
  //       options: [{ label: 'Yes' }, { label: 'No' }],
  //     },
  //     {
  //       question: 'What is the main benefit you received from our service?',
  //       label: 'mainBenefitReceived',
  //       instruction: 'List as many as you can, separated by commas.',
  //     },
  //     {
  //       question: 'How can we improve our service to better meet your needs?',
  //       label: 'improvablePoint',
  //       instruction: 'List as many as you can, separated by commas.',
  //     },
  //   ];

  //   const productEvaluationQuestions = [{}];

  //   {
  //     id: 'productEvaluation_7',
  //     order: 7,
  //     question: 'How satisfied are you with A?',
  //     type: 'singleAnswers',
  //     label: 'AAA', // product_name
  //     answer: 3,
  //   },
  //   {
  //     id: 'productEvaluation_8',
  //     order: 8,
  //     question: 'How satisfied are you with B?',
  //     type: 'singleAnswers',
  //     label: 'BBB', // product_name
  //     answer: undefined,
  //   },
  //   {
  //     id: 'productEvaluation_9',
  //     order: 9,
  //     question: 'How satisfied are you with C?',
  //     type: 'singleAnswers',
  //     label: 'CCC', // product_name
  //     answer: undefined,
  //   },
  //   {
  //     id: 'productEvaluation_10',
  //     order: 10,
  //     question: 'What kind of product do you want to add to our line-up?',
  //     type: 'text',
  //     label: 'mainBenefitReceived',
  //     description: 'List as many as you can, separated by commas.',
  //     answer: undefined,
  //   },
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
