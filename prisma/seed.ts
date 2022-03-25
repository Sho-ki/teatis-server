import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const customerNutritionItems = [
    {
      name: 'BMR',
      label: 'BMR',
    },
    {
      name: 'carbsMacronutrients',
      label: 'Carbs Macronutrients',
    },
    {
      name: 'proteinMacronutrients',
      label: 'Protein Macronutrients',
    },
    {
      name: 'fat Macronutrients',
      label: 'Fat Macronutrients',
    },
    {
      name: 'carbsPerMeal',
      label: 'Carbs Per Meal',
    },
    {
      name: 'proteinPerMeal',
      label: 'Protein Per Meal',
    },
    {
      name: 'fatPerMeal',
      label: 'Fat Per Meal',
    },
    {
      name: 'caloriePerMeal',
      label: 'Calorie PerMeal',
    },
  ];

  for (let customerNutritionItem of customerNutritionItems) {
    await prisma.customerNutritionNeed.upsert({
      where: { name: customerNutritionItem.name },
      update: {},
      create: {
        label: customerNutritionItem.label,
        name: customerNutritionItem.name,
      },
    });
  }

  const surveyCreationItems = [
    {
      surveyName: 'post-purchase',
      surveyLabel: 'Post Purchase Survey',
      question: {
        label: 'What kind of product do you want to add to our line-up?',
        name: 'productLineUp',
        mustBeAnswered: false,
        category: 'productFeedback',
        categoryLabel: 'Product Feedback',
        answerType: 'text',
        answerTypeLabel: 'text',
        instruction: 'List as many as you can, separated by commas.',
        displayOrder: 2,
      },
    },
    {
      surveyName: 'post-purchase',
      surveyLabel: 'Post Purchase Survey',
      question: {
        label: 'How satisfied are you with ${PRODUCT_NAME}?',
        name: 'productSatisfaction',
        mustBeAnswered: false,
        category: 'productFeedback',
        categoryLabel: 'Product Feedback',
        answerType: 'numeric',
        answerTypeLabel: 'numeric',
        displayOrder: 1,
      },
    },
  ];

  for (let surveyCreationItem of surveyCreationItems) {
    const surveyQuery = await prisma.survey.upsert({
      where: { name: surveyCreationItem.surveyName },
      create: {
        name: surveyCreationItem.surveyName,
        label: surveyCreationItem.surveyLabel,
      },
      update: {
        name: surveyCreationItem.surveyName,
        label: surveyCreationItem.surveyLabel,
      },
    });

    const questionQuery = await prisma.surveyQuestion.upsert({
      where: { name: surveyCreationItem.question.name },
      create: {
        label: surveyCreationItem.question.label,
        name: surveyCreationItem.question.name,

        mustBeAnswered: surveyCreationItem.question.mustBeAnswered,
        questionCategory: {
          connectOrCreate: {
            where: { name: surveyCreationItem.question.category },
            create: {
              name: surveyCreationItem.question.category,
              label: surveyCreationItem.question.categoryLabel,
            },
          },
        },
        surveyQuestionOptions: {},
        surveyQuestionAnswerType: {
          connectOrCreate: {
            where: { name: surveyCreationItem.question.answerType },
            create: {
              name: surveyCreationItem.question.answerType,
              label: surveyCreationItem.question.answerTypeLabel,
            },
          },
        },
      },
      update: {
        label: surveyCreationItem.question.label,
        name: surveyCreationItem.question.name,
        mustBeAnswered: surveyCreationItem.question.mustBeAnswered,
        questionCategory: {
          connectOrCreate: {
            where: { name: surveyCreationItem.question.category },
            create: {
              name: surveyCreationItem.question.category,
              label: surveyCreationItem.question.categoryLabel,
            },
          },
        },
        surveyQuestionOptions: {},
        surveyQuestionAnswerType: {
          connectOrCreate: {
            where: { name: surveyCreationItem.question.answerType },
            create: {
              name: surveyCreationItem.question.answerType,
              label: surveyCreationItem.question.answerTypeLabel,
            },
          },
        },
      },
    });
    if (surveyCreationItem.question['options']) {
      for (let option of surveyCreationItem.question['options']) {
        await prisma.surveyQuestionOption.upsert({
          where: {
            QuestionOptionIdentifier: {
              surveyQuestionId: questionQuery.id,
              name: option.name,
            },
          },
          create: {
            surveyQuestionId: questionQuery.id,
            label: option.label,
            name: option.name,
          },
          update: {
            surveyQuestionId: questionQuery.id,
            label: option.label,
            name: option.name,
          },
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
        displayOrder: surveyCreationItem.question.displayOrder,
        surveyId: surveyQuery.id,
        surveyQuestionId: questionQuery.id,
      },
      update: {
        surveyId: surveyQuery.id,
        surveyQuestionId: questionQuery.id,
        displayOrder: surveyCreationItem.question.displayOrder,
      },
    });
  }

  const providerData = JSON.parse(
    fs.readFileSync('./defaultData/provider.json', 'utf8'),
  );

  for (let productPovider of providerData.productPoviders) {
    await prisma.productProvider.upsert({
      where: { provider: productPovider.provider },
      update: { provider: productPovider.provider },
      create: {
        provider: productPovider.provider,
      },
    });
  }

  const flavorData = JSON.parse(
    fs.readFileSync('./defaultData/flavor.json', 'utf8'),
  );

  for (let flavor of flavorData.flavors) {
    await prisma.productFlavor.upsert({
      where: { name: flavor.name },
      create: { name: flavor.name, label: flavor.label },
      update: { name: flavor.name, label: flavor.label },
    });
  }

  const categoryData = JSON.parse(
    fs.readFileSync('./defaultData/category.json', 'utf8'),
  );

  for (let category of categoryData.categories) {
    await prisma.productCategory.upsert({
      where: { name: category.name },
      create: { name: category.name, label: category.label, src: category.src },
      update: { name: category.name, label: category.label, src: category.src },
    });
  }

  const allergenData = JSON.parse(
    fs.readFileSync('./defaultData/allergen.json', 'utf8'),
  );

  for (let allergen of allergenData.allergens) {
    await prisma.productAllergen.upsert({
      where: { name: allergen.name },
      create: { name: allergen.name, label: allergen.label },
      update: { name: allergen.name, label: allergen.label },
    });
  }

  const ingredientData = JSON.parse(
    fs.readFileSync('./defaultData/ingredient.json', 'utf8'),
  );

  for (let ingredient of ingredientData.ingredients) {
    await prisma.productIngredient.upsert({
      where: { name: ingredient.name },
      create: { name: ingredient.name, label: ingredient.label },
      update: { name: ingredient.name, label: ingredient.label },
    });
  }

  const cookingMethodsData = JSON.parse(
    fs.readFileSync('./defaultData/cookingMethod.json', 'utf8'),
  );

  for (let cookingMethod of cookingMethodsData.cookingMethods) {
    await prisma.productCookingMethod.upsert({
      where: { name: cookingMethod.name },
      create: { name: cookingMethod.name, label: cookingMethod.label },
      update: { name: cookingMethod.name, label: cookingMethod.label },
    });
  }

  const vendorsData = JSON.parse(
    fs.readFileSync('./defaultData/vendor.json', 'utf8'),
  );

  for (let vendor of vendorsData.vendors) {
    await prisma.productVendor.upsert({
      where: { name: vendor.name },
      create: { name: vendor.name, label: vendor.label },
      update: { name: vendor.name, label: vendor.label },
    });
  }

  const foodTypesData = JSON.parse(
    fs.readFileSync('./defaultData/foodType.json', 'utf8'),
  );

  for (let foodType of foodTypesData.foodTypes) {
    await prisma.productFoodType.upsert({
      where: { name: foodType.name },
      create: { name: foodType.name, label: foodType.label },
      update: { name: foodType.name, label: foodType.label },
    });
  }

  const medicalConditionsData = JSON.parse(
    fs.readFileSync('./defaultData/medicalCondition.json', 'utf8'),
  );

  for (let medicalCondition of medicalConditionsData.medicalConditions) {
    await prisma.customerMedicalCondition.upsert({
      where: { name: medicalCondition.name },
      create: { name: medicalCondition.name, label: medicalCondition.label },
      update: { name: medicalCondition.name, label: medicalCondition.label },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
