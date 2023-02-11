/* eslint-disable no-console */
import {  PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const migrateCustomerFeatures = async() => {

  const client = new PrismaClient();

  const heightOptions = await client.surveyQuestionOption.findMany(
    { where: { surveyQuestion: { name: 'height' } }, include: { surveyQuestion: true }  });

  const weightOptions = await client.surveyQuestionOption.findMany(
    { where: {  surveyQuestion: { name: 'weight' } }, include: { surveyQuestion: true }   });

  const ageOptions = await client.surveyQuestionOption.findMany(
    { where: {  surveyQuestion: { name: 'age' } }, include: { surveyQuestion: true }  });
  const allCustomers = await client.customers.findMany({});

  const heightIdSet = {
    145: heightOptions.find(val => val.value === 145).id,
    155: heightOptions.find(val => val.value === 155).id,
    165: heightOptions.find(val => val.value === 165).id,
    175: heightOptions.find(val => val.value === 175).id,
    185: heightOptions.find(val => val.value === 185).id,
    195: heightOptions.find(val => val.value === 195).id,
    205: heightOptions.find(val => val.value === 205).id,
  };

  const weightIdSet = {
    55: weightOptions.find(val => val.value === 55).id,
    65: weightOptions.find(val => val.value === 65).id,
    75: weightOptions.find(val => val.value === 75).id,
    85: weightOptions.find(val => val.value === 85).id,
    95: weightOptions.find(val => val.value === 95).id,
    105: weightOptions.find(val => val.value === 105).id,
    115: weightOptions.find(val => val.value === 115).id,
    125: weightOptions.find(val => val.value === 125).id,
    135: weightOptions.find(val => val.value === 135).id,
    145: weightOptions.find(val => val.value === 145).id,
    155: weightOptions.find(val => val.value === 155).id,
  };

  const ageIdSet = {
    15: ageOptions.find(val => val.value === 15).id,
    25: ageOptions.find(val => val.value === 25).id,
    35: ageOptions.find(val => val.value === 35).id,
    45: ageOptions.find(val => val.value === 45).id,
    55: ageOptions.find(val => val.value === 55).id,
    65: ageOptions.find(val => val.value === 65).id,
    75: ageOptions.find(val => val.value === 75).id,
  };
  for(const customer of allCustomers){
    console.log('_____________________');

    const { heightCm, weightKg, age, id, createdAt, updatedAt  } = customer;

    let heightOptionId:number;

    if(heightCm <= 145) heightOptionId = heightIdSet[145];
    else if(heightCm <= 155) heightOptionId = heightIdSet[155];
    else if(heightCm <= 165) heightOptionId = heightIdSet[165];
    else if(heightCm <= 175) heightOptionId = heightIdSet[175];
    else if(heightCm <= 185) heightOptionId = heightIdSet[185];
    else if(heightCm <= 195) heightOptionId = heightIdSet[195];
    else if(heightCm <= 205) heightOptionId = heightIdSet[205];
    else heightOptionId = heightIdSet[165];
    console.log('heightOptionId: ', heightOptionId);
    let weightOptionId:number;

    if(weightKg <= 55) weightOptionId = weightIdSet[55];
    else if(weightKg <= 65) weightOptionId = weightIdSet[65];
    else if(weightKg <= 75) weightOptionId = weightIdSet[75];
    else if(weightKg <= 85) weightOptionId = weightIdSet[85];
    else if(weightKg <= 95) weightOptionId = weightIdSet[95];
    else if(weightKg <= 105) weightOptionId = weightIdSet[105];
    else if(weightKg <= 115) weightOptionId = weightIdSet[115];
    else if(weightKg <= 125) weightOptionId = weightIdSet[125];
    else if(weightKg <= 135) weightOptionId = weightIdSet[135];
    else if(weightKg <= 145) weightOptionId = weightIdSet[145];
    else if(weightKg <= 155) weightOptionId = weightIdSet[155];
    else weightOptionId = weightIdSet[95];
    console.log('weightOptionId: ', weightOptionId);

    let ageOptionId:number;

    if(age <= 15) ageOptionId = ageIdSet[15];
    else if(age <= 25) ageOptionId = ageIdSet[25];
    else if(age <= 35) ageOptionId = ageIdSet[35];
    else if(age <= 45) ageOptionId = ageIdSet[45];
    else if(age <= 55) ageOptionId = ageIdSet[55];
    else if(age <= 65) ageOptionId = ageIdSet[65];
    else if(age <= 75) ageOptionId = ageIdSet[75];
    else ageOptionId = ageIdSet[55];

    console.log('ageOptionId: ', ageOptionId);
    const createHistory = await client.customerSurveyHistory.create(
      { data: { createdAt, updatedAt, customer: { connect: { id } }, survey: { connect: { name: 'prePurchaseSurvey' } } } });

    await client.surveyQuestionResponse.createMany({
      data:
         [
           {
             surveyQuestionId: heightOptions[0].surveyQuestion.id,
             response: heightOptionId,
             createdAt, updatedAt,
             customerSurveyHistoryId: createHistory.id,
           },
           {
             surveyQuestionId: weightOptions[0].surveyQuestion.id,
             response: weightOptionId,
             createdAt, updatedAt,
             customerSurveyHistoryId: createHistory.id,
           },
           {
             surveyQuestionId: ageOptions[0].surveyQuestion.id,
             response: ageOptionId,
             createdAt, updatedAt,
             customerSurveyHistoryId: createHistory.id,
           },
         ],
    });
  }
  return;

};

migrateCustomerFeatures();
