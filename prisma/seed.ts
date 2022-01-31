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
    await prisma.customerNutritionItem.upsert({
      where: { label: customerNutritionItem.label },
      update: {},
      create: {
        label: customerNutritionItem.label,
        description: customerNutritionItem.description,
      },
    });
  }

  //   const croductPoviders = [{ provider: 'shiphero' }];

  //   for (let croductPovider of croductPoviders) {
  //     await prisma.productPovider.upsert({
  //       where: { provider: croductPovider.provider },
  //       update: {},
  //       create: {
  //         provider: croductPovider.provider,
  //       },
  //     });
  //   }
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
  //     type: 'multipleOptions',
  //     label: 'AAA', // product_name
  //     answer: 3,
  //   },
  //   {
  //     id: 'productEvaluation_8',
  //     order: 8,
  //     question: 'How satisfied are you with B?',
  //     type: 'multipleOptions',
  //     label: 'BBB', // product_name
  //     answer: undefined,
  //   },
  //   {
  //     id: 'productEvaluation_9',
  //     order: 9,
  //     question: 'How satisfied are you with C?',
  //     type: 'multipleOptions',
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
