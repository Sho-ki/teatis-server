import { PrismaClient } from '@prisma/client';
import  seedSurveyDrivers  from '../defaultData/surveyDrivers';
import { seedSurvey } from '../defaultData/surveyNormalAndSurveyEmployees';
import { testEmployers } from '../defaultData/testEmployer';
import { weeklyCheckIn } from '../defaultData/weeklyCheckIn';
// import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  await upsertSurvey(); // currently only create
  await upsertWeeklyCheckin(); // currently only create

  await upsertEmployers();

  await upsertSurveyDrivers();
  // const customerNutritionItems = [
  //   {
  //     name: 'BMR',
  //     label: 'BMR',
  //   },
  //   {
  //     name: 'carbsMacronutrients',
  //     label: 'Carbs Macronutrients',
  //   },
  //   {
  //     name: 'proteinMacronutrients',
  //     label: 'Protein Macronutrients',
  //   },
  //   {
  //     name: 'fatMacronutrients',
  //     label: 'Fat Macronutrients',
  //   },
  //   {
  //     name: 'carbsPerMeal',
  //     label: 'Carbs Per Meal',
  //   },
  //   {
  //     name: 'proteinPerMeal',
  //     label: 'Protein Per Meal',
  //   },
  //   {
  //     name: 'fatPerMeal',
  //     label: 'Fat Per Meal',
  //   },
  //   {
  //     name: 'caloriePerMeal',
  //     label: 'Calorie PerMeal',
  //   },
  // ];

  // for (const customerNutritionItem of customerNutritionItems) {
  //   await prisma.customerNutritionNeed.upsert({
  //     where: { name: customerNutritionItem.name },
  //     update: {},
  //     create: {
  //       label: customerNutritionItem.label,
  //       name: customerNutritionItem.name,
  //     },
  //   });
  // }

  // const surveyCreationItems = [
  //   {
  //     surveyName: 'post-purchase',
  //     surveyLabel: 'Post Purchase Survey',
  //     question: {
  //       label: 'What kind of product do you want to add to our line-up?',
  //       name: 'productLineUp',
  //       mustBeAnswered: false,
  //       category: 'serviceFeedback',
  //       categoryLabel: 'Service Feedback',
  //       answerType: 'text',
  //       answerTypeLabel: 'text',
  //       instruction: 'List as many as you can, separated by commas.',
  //       displayOrder: 2,
  //     },
  //   },
  //   {
  //     surveyName: 'post-purchase',
  //     surveyLabel: 'Post Purchase Survey',
  //     question: {
  //       label: 'How satisfied are you with ${PRODUCT_NAME}?',
  //       name: 'productSatisfaction',
  //       mustBeAnswered: false,
  //       category: 'productFeedback',
  //       categoryLabel: 'Product Feedback',
  //       answerType: 'numeric',
  //       answerTypeLabel: 'numeric',
  //       displayOrder: 1,
  //     },
  //   },
  // ];

  // for (const surveyCreationItem of surveyCreationItems) {
  //   const surveyQuery = await prisma.survey.upsert({
  //     where: { name: surveyCreationItem.surveyName },
  //     create: {
  //       name: surveyCreationItem.surveyName,
  //       label: surveyCreationItem.surveyLabel,
  //     },
  //     update: {
  //       name: surveyCreationItem.surveyName,
  //       label: surveyCreationItem.surveyLabel,
  //     },
  //   });

  //   const questionQuery = await prisma.surveyQuestion.upsert({
  //     where: { name: surveyCreationItem.question.name },
  //     create: {
  //       label: surveyCreationItem.question.label,
  //       name: surveyCreationItem.question.name,

  //       mustBeAnswered: surveyCreationItem.question.mustBeAnswered,
  //       questionCategory: {
  //         connectOrCreate: {
  //           where: { name: surveyCreationItem.question.category },
  //           create: {
  //             name: surveyCreationItem.question.category,
  //             label: surveyCreationItem.question.categoryLabel,
  //           },
  //         },
  //       },
  //       surveyQuestionOptions: {},
  //       surveyQuestionAnswerType: {
  //         connectOrCreate: {
  //           where: { name: surveyCreationItem.question.answerType },
  //           create: {
  //             name: surveyCreationItem.question.answerType,
  //             label: surveyCreationItem.question.answerTypeLabel,
  //           },
  //         },
  //       },
  //     },
  //     update: {
  //       label: surveyCreationItem.question.label,
  //       name: surveyCreationItem.question.name,
  //       mustBeAnswered: surveyCreationItem.question.mustBeAnswered,
  //       questionCategory: {
  //         connectOrCreate: {
  //           where: { name: surveyCreationItem.question.category },
  //           create: {
  //             name: surveyCreationItem.question.category,
  //             label: surveyCreationItem.question.categoryLabel,
  //           },
  //         },
  //       },
  //       surveyQuestionOptions: {},
  //       surveyQuestionAnswerType: {
  //         connectOrCreate: {
  //           where: { name: surveyCreationItem.question.answerType },
  //           create: {
  //             name: surveyCreationItem.question.answerType,
  //             label: surveyCreationItem.question.answerTypeLabel,
  //           },
  //         },
  //       },
  //     },
  //   });
  //   if (surveyCreationItem.question['options']) {
  //     for (const option of surveyCreationItem.question['options']) {
  //       await prisma.surveyQuestionOption.upsert({
  //         where: {
  //           QuestionOptionIdentifier: {
  //             surveyQuestionId: questionQuery.id,
  //             name: option.name,
  //           },
  //         },
  //         create: {
  //           surveyQuestionId: questionQuery.id,
  //           label: option.label,
  //           name: option.name,
  //         },
  //         update: {
  //           surveyQuestionId: questionQuery.id,
  //           label: option.label,
  //           name: option.name,
  //         },
  //       });
  //     }
  //   }
  //   await prisma.intermediateSurveyQuestion.upsert({
  //     where: {
  //       surveyId_surveyQuestionId: {
  //         surveyId: surveyQuery.id,
  //         surveyQuestionId: questionQuery.id,
  //       },
  //     },
  //     create: {
  //       displayOrder: surveyCreationItem.question.displayOrder,
  //       surveyId: surveyQuery.id,
  //       surveyQuestionId: questionQuery.id,
  //     },
  //     update: {
  //       surveyId: surveyQuery.id,
  //       surveyQuestionId: questionQuery.id,
  //       displayOrder: surveyCreationItem.question.displayOrder,
  //     },
  //   });
  // }

  // const providerData = JSON.parse(
  //   fs.readFileSync('./defaultData/provider.json', 'utf8'),
  // );

  // for (let productPovider of providerData.productPoviders) {
  //   await prisma.productProvider.upsert({
  //     where: { provider: productPovider.provider },
  //     update: { provider: productPovider.provider },
  //     create: {
  //       provider: productPovider.provider,
  //     },
  //   });
  // }

  // const flavorData = JSON.parse(
  //   fs.readFileSync('./defaultData/flavor.json', 'utf8'),
  // );

  // for (let flavor of flavorData.flavors) {
  //   await prisma.productFlavor.upsert({
  //     where: { name: flavor.name },
  //     create: { name: flavor.name, label: flavor.label },
  //     update: { name: flavor.name, label: flavor.label },
  //   });
  // }

  // const categoryData = JSON.parse(
  //   fs.readFileSync('./defaultData/category.json', 'utf8'),
  // );

  // for (let category of categoryData.categories) {
  //   await prisma.productCategory.upsert({
  //     where: { name: category.name },
  //     create: { name: category.name, label: category.label, src: category.src },
  //     update: { name: category.name, label: category.label, src: category.src },
  //   });
  // }

  // const allergenData = JSON.parse(
  //   fs.readFileSync('./defaultData/allergen.json', 'utf8'),
  // );

  // for (let allergen of allergenData.allergens) {
  //   await prisma.productAllergen.upsert({
  //     where: { name: allergen.name },
  //     create: { name: allergen.name, label: allergen.label },
  //     update: { name: allergen.name, label: allergen.label },
  //   });
  // }

  // const ingredientData = JSON.parse(
  //   fs.readFileSync('./defaultData/ingredient.json', 'utf8'),
  // );

  // for (let ingredient of ingredientData.ingredients) {
  //   await prisma.productIngredient.upsert({
  //     where: { name: ingredient.name },
  //     create: { name: ingredient.name, label: ingredient.label },
  //     update: { name: ingredient.name, label: ingredient.label },
  //   });
  // }

  // const cookingMethodsData = JSON.parse(
  //   fs.readFileSync('./defaultData/cookingMethod.json', 'utf8'),
  // );

  // for (let cookingMethod of cookingMethodsData.cookingMethods) {
  //   await prisma.productCookingMethod.upsert({
  //     where: { name: cookingMethod.name },
  //     create: { name: cookingMethod.name, label: cookingMethod.label },
  //     update: { name: cookingMethod.name, label: cookingMethod.label },
  //   });
  // }

  // const vendorsData = JSON.parse(
  //   fs.readFileSync('./defaultData/vendor.json', 'utf8'),
  // );

  // for (let vendor of vendorsData.vendors) {
  //   await prisma.productVendor.upsert({
  //     where: { name: vendor.name },
  //     create: { name: vendor.name, label: vendor.label },
  //     update: { name: vendor.name, label: vendor.label },
  //   });
  // }

  // const foodTypesData = JSON.parse(
  //   fs.readFileSync('./defaultData/foodType.json', 'utf8'),
  // );

  // for (let foodType of foodTypesData.foodTypes) {
  //   await prisma.productFoodType.upsert({
  //     where: { name: foodType.name },
  //     create: { name: foodType.name, label: foodType.label },
  //     update: { name: foodType.name, label: foodType.label },
  //   });
  // }

  // const medicalConditionsData = JSON.parse(
  //   fs.readFileSync('./defaultData/medicalCondition.json', 'utf8'),
  // );

  // for (const medicalCondition of medicalConditionsData.medicalConditions) {
  //   await prisma.customerMedicalCondition.upsert({
  //     where: { name: medicalCondition.name },
  //     create: { name: medicalCondition.name, label: medicalCondition.label },
  //     update: { name: medicalCondition.name, label: medicalCondition.label },
  //   });
  // }

}

const upsertEmployers = async() => {
  for(const employer of testEmployers){
    const { name, label, uuid } = employer;
    await prisma.employer.upsert({
      where: { name },
      create: {
        name,
        label,
        uuid,
      },
      update: { label },
    });
  }
};

const upsertSurvey = async() => {
  for(const survey of seedSurvey){
    const { name, label, questions } = survey;
    const surveyResponse = await prisma.survey.upsert({
      where: { name: survey.name },
      create: {
        name,
        label,
      },
      update: { label },
    });

    for(const question of questions){
      const {
        name: questionName, label: questionLabel, responseType, isCustomerFeature, images, isRequired,
        displayOrder, options, placeholder, hint, children,
      } = question;

      const findQuestion = await prisma.surveyQuestion.findUnique({ where: { name: questionName } });
      if(findQuestion){
        await prisma.intermediateSurveyQuestion.upsert({
          where: { surveyId_surveyQuestionId: { surveyId: surveyResponse.id, surveyQuestionId: findQuestion.id } },
          create: {
            surveyId: surveyResponse.id,
            surveyQuestionId: findQuestion.id,
            displayOrder,
          },
          update: { displayOrder },
        });
        await prisma.surveyQuestion.update({
          where: { id: findQuestion.id },
          data: { isCustomerFeature, isRequired, placeholder, hint, responseType },
        });

        if(children){
          let i = 1;
          for(const child of children){
            const { name: childQuestionName } = child;
            const childResponse = await prisma.surveyQuestion.findUnique({ where: { name: childQuestionName } });
            if(childResponse){
              await prisma.intermediateSurveyQuestion.upsert({
                where: {
                  surveyId_surveyQuestionId:
                  { surveyId: surveyResponse.id, surveyQuestionId: childResponse.id },
                },
                create: {
                  surveyId: surveyResponse.id,
                  surveyQuestionId: childResponse.id,
                  displayOrder: i,
                },
                update: { displayOrder: i },
              });
            }
            i++;
          }
        }
      }

      if(!findQuestion){
        const questionResponse = await prisma.surveyQuestion.create({
          data: {
            name: questionName,
            label: questionLabel,
            responseType, isCustomerFeature, isRequired,
            placeholder, hint,
            image: images && images.length?{
              createMany:
               { data: images?.map(({ position, src }) => { return { position, src }; } ) },
            }:{},
            surveyQuestionOptions: options && options.length? {
              createMany:
               { data: options?.map(({ label, value }) => { return { label, value }; } ) },
            }:{},
          },
        });

        if(children){
          let i = 1;
          for(const child of children){
            const {
              name: childQuestionName, label: childQuestionLabel, responseType, isCustomerFeature, images, isRequired,
              options, placeholder, hint,
            } = child;
            const childResponse = await prisma.surveyQuestion.create({
              data: {
                name: childQuestionName,
                label: childQuestionLabel,
                responseType, isCustomerFeature, isRequired,
                placeholder, hint,
                parentSurveyQuestionId: questionResponse.id,
                image: images && images.length?{
                  createMany:
               { data: images?.map(({ position, src }) => { return { position, src }; } ) },
                }:{},
                surveyQuestionOptions: options && options.length?{
                  createMany:
               { data: options?.map(({ label, value }) => { return { label, value }; } ) },
                }:{},
              },
            });

            await prisma.intermediateSurveyQuestion.create({
              data: {
                surveyId: surveyResponse.id,
                surveyQuestionId: childResponse.id,
                displayOrder: i,
              },
            });
            i++;
          }
        }
        await prisma.intermediateSurveyQuestion.create({
          data: {
            surveyId: surveyResponse.id,
            surveyQuestionId: questionResponse.id,
            displayOrder,
          },
        });
      }
    }
  }
};

const upsertWeeklyCheckin = async() => {
  for(const survey of weeklyCheckIn){
    const { name, label, questions } = survey;
    const surveyResponse = await prisma.survey.upsert({
      where: { name: survey.name },
      create: {
        name,
        label,
      },
      update: { label },
    });

    for(const question of questions){
      const {
        name: questionName, label: questionLabel, responseType, isCustomerFeature, images, isRequired,
        displayOrder, options, placeholder, hint,
      } = question;

      const findQuestion = await prisma.surveyQuestion.findUnique({ where: { name: questionName } });
      if(!findQuestion){
        const questionResponse = await prisma.surveyQuestion.create({
          data: {
            name: questionName,
            label: questionLabel,
            responseType, isCustomerFeature, isRequired,
            placeholder, hint,
            image: images && images.length?{
              createMany:
               { data: images?.map(({ position, src }) => { return { position, src }; } ) },
            }:{},
            surveyQuestionOptions: options && options.length? {
              createMany:
               { data: options?.map(({ label, value }) => { return { label, value }; } ) },
            }:{},
          },
        });
        await prisma.intermediateSurveyQuestion.create({
          data: {
            surveyId: surveyResponse.id,
            surveyQuestionId: questionResponse.id,
            displayOrder,
          },
        });
      }
    }
  }
};

const upsertSurveyDrivers = async() => {
  const { name, label, questions } = seedSurveyDrivers;
  const surveyResponse = await prisma.survey.upsert({
    where: { name },
    create: {
      name,
      label,
    },
    update: { label },
  });

  for(const question of questions){
    const {
      name: questionName, label: questionLabel, responseType, isCustomerFeature, images, isRequired,
      displayOrder, options, placeholder, hint, children,
    } = question;

    const findQuestion = await prisma.surveyQuestion.findUnique({ where: { name: questionName } });
    if(findQuestion){
      await prisma.intermediateSurveyQuestion.upsert({
        where: { surveyId_surveyQuestionId: { surveyId: surveyResponse.id, surveyQuestionId: findQuestion.id } },
        create: {
          surveyId: surveyResponse.id,
          surveyQuestionId: findQuestion.id,
          displayOrder,
        },
        update: { displayOrder },
      });
      await prisma.surveyQuestion.update({
        where: { id: findQuestion.id },
        data: { label: questionLabel, isCustomerFeature, isRequired, placeholder, hint, responseType },
      });

      if(children){
        let i = 1;
        for(const child of children){
          const { name: childQuestionName } = child;
          const childResponse = await prisma.surveyQuestion.findUnique({ where: { name: childQuestionName } });
          if(childResponse){
            await prisma.intermediateSurveyQuestion.upsert({
              where: {
                surveyId_surveyQuestionId:
                  { surveyId: surveyResponse.id, surveyQuestionId: childResponse.id },
              },
              create: {
                surveyId: surveyResponse.id,
                surveyQuestionId: childResponse.id,
                displayOrder: i,
              },
              update: { displayOrder: i },
            });
          }
          i++;
        }
      }
    }

    if(!findQuestion){
      const questionResponse = await prisma.surveyQuestion.create({
        data: {
          name: questionName,
          label: questionLabel,
          responseType, isCustomerFeature, isRequired,
          placeholder, hint,
          image: images && images.length?{
            createMany:
               { data: images?.map(({ position, src }) => { return { position, src }; } ) },
          }:{},
          surveyQuestionOptions: options && options.length? {
            createMany:
               { data: options?.map(({ label, value }) => { return { label, value }; } ) },
          }:{},
        },
      });

      if(children){
        let i = 1;
        for(const child of children){
          const {
            name: childQuestionName, label: childQuestionLabel, responseType, isCustomerFeature, images, isRequired,
            options, placeholder, hint,
          } = child;
          const childResponse = await prisma.surveyQuestion.create({
            data: {
              name: childQuestionName,
              label: childQuestionLabel,
              responseType, isCustomerFeature, isRequired,
              placeholder, hint,
              parentSurveyQuestionId: questionResponse.id,
              image: images && images.length?{
                createMany:
               { data: images?.map(({ position, src }) => { return { position, src }; } ) },
              }:{},
              surveyQuestionOptions: options && options.length?{
                createMany:
               { data: options?.map(({ label, value }) => { return { label, value }; } ) },
              }:{},
            },
          });

          await prisma.intermediateSurveyQuestion.create({
            data: {
              surveyId: surveyResponse.id,
              surveyQuestionId: childResponse.id,
              displayOrder: i,
            },
          });
          i++;
        }
      }
      await prisma.intermediateSurveyQuestion.create({
        data: {
          surveyId: surveyResponse.id,
          surveyQuestionId: questionResponse.id,
          displayOrder,
        },
      });
    }
  }
};

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
