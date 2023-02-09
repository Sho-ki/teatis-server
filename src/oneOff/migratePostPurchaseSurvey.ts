/* eslint-disable no-console */
import { Prisma, PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const migratePostPurchaseSurvey = async() => {

  const client = new PrismaClient();

  const yesId = await client.surveyQuestionOption.findFirst(
    { where: {  label: 'Yes', surveyQuestion: { name: 'productGlucose' } }  });

  const noId = await client.surveyQuestionOption.findFirst(
    { where: {  label: 'No', surveyQuestion: { name: 'productGlucose' } }  });

  const unknownId = await client.surveyQuestionOption.findFirst(
    { where: {  label: 'Unknown', surveyQuestion: { name: 'productGlucose' } } });

  const allResponses = await client.surveyQuestionAnswer.findMany({ where: { surveyQuestionId: 2 } });

  const output = {};
  for (const item of allResponses) {
    const { customerId, orderNumber, productId, answerNumeric, reason, glucoseImpact, createdAt, updatedAt } = item;

    if (!output[customerId]) {
      output[customerId] = {};
    }

    if (!output[customerId][orderNumber]) {
      output[customerId][orderNumber] = [];
    }

    output[customerId][orderNumber].push({ productId, answerNumeric, reason, glucoseImpact, createdAt, updatedAt });
  }

  const allCustomerIds = Object.keys(output);
  for(const customerId of allCustomerIds){
    try{

      const allCustomerOrderNumbers = Object.keys(output[customerId]);
      for(const orderNumber of allCustomerOrderNumbers){
        const customerRates = output[customerId][orderNumber];

        const createHistory = await client.customerSurveyHistory.create(
          { data: { createdAt: customerRates[0].createdAt, updatedAt: customerRates[0].updatedAt, orderNumber, customer: { connect: { id: Number(customerId) } }, survey: { connect: { name: 'postPurchaseSurvey' } } } });

        for(const rate of customerRates){
          const productId = rate.productId;
          await client.surveyQuestionResponse.create(
            {
              data: {
                createdAt: rate.createdAt,
                updatedAt: rate.updatedAt,
                customerSurveyHistory: { connect: { id: createHistory.id } },
                response: rate?.answerNumeric || Prisma.DbNull,
                surveyQuestion: { connect: { name: 'productSatisfaction' } },
                intermediateProductSurveyQuestionResponse: {
                  create: {
                    productId,
                    createdAt: rate.createdAt,
                    updatedAt: rate.updatedAt,
                  },
                },
              },
            }
          );

          if(rate.reason){
            await client.surveyQuestionResponse.create(
              {
                data: {
                  createdAt: rate.createdAt,
                  updatedAt: rate.updatedAt,
                  customerSurveyHistory: { connect: { id: createHistory.id } },
                  response: rate.reason || Prisma.DbNull,
                  surveyQuestion: { connect: { name: 'productSatisfactionReason' } },
                  intermediateProductSurveyQuestionResponse: {
                    create: {
                      productId,
                      createdAt: rate.createdAt,
                      updatedAt: rate.updatedAt,
                    },
                  },
                },
              }
            );
          }
          if(rate.glucoseImpact){
            const glucoseRes = rate.glucoseImpact === 1?yesId.id:
              rate.glucoseImpact === 2?noId.id :
              unknownId.id;

            await client.surveyQuestionResponse.create(
              {
                data: {
                  createdAt: rate.createdAt,
                  updatedAt: rate.updatedAt,
                  customerSurveyHistory: { connect: { id: createHistory.id } },
                  response: glucoseRes,
                  surveyQuestion: { connect: { name: 'productGlucose' } },
                  intermediateProductSurveyQuestionResponse: {
                    create: {
                      productId,
                      createdAt: rate.createdAt,
                      updatedAt: rate.updatedAt,
                    },
                  },
                },
              }
            );
          }
        }
      }
    }catch(e){
      console.log('START__________');
      console.log(e);
      console.log(customerId);
      console.log('_______________END');
    }
  }

};

migratePostPurchaseSurvey();
