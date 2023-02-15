import { SurveyQuestion, SurveyQuestionImage, SurveyQuestionOption } from '@prisma/client';

interface Survey {
  name:string;
  label:string;
  questions: Question[];
}

interface Question extends Omit<SurveyQuestion, 'id' | 'createdAt' | 'updatedAt'>{
  children?:Question[];
  displayOrder?:number;
  images?:Omit<SurveyQuestionImage, 'id' | 'createdAt' | 'updatedAt' | 'surveyQuestionId'>[];
  options:Omit<SurveyQuestionOption, 'id' | 'createdAt' | 'updatedAt' | 'surveyQuestionId'>[];
}
const bloodSugar = [
  '~50',
  '50-70',
  '70-90',
  '90-110',
  '110-130',
  '130-150',
  '150-170',
  '170-190',
  '190-210',
  '210-230',
  '230-250',
  '250-270',
  '270-290',
  '290+',
];
const waterAmount = Array.from({ length: 12 }, (_, i) => String(i + 1));
const exerciseAmount = [
  '0-30',
  '30-60',
  '60-90',
  '90-120',
  '120-150',
  '150-180',
  '180+',
];
const createOptions = (labels: string[]) => {
  const options = labels.map(label => {
    const [min, max] = label.split('-').map(parseFloat);
    const value = isNaN(min) ? max : (isNaN(max) ? min : (min + max) / 2);
    return { label, isArchived: false, value };
  });
  return options;
};
export const weeklyCheckIn:Survey[] = [
  {
    name: 'weeklyCheckIn',
    label: 'Weekly Check-in',
    questions: [
      {
        displayOrder: 1,
        name: 'bloodSugarBeforeMeal',
        label: 'What was your blood sugar in mg/dl before meal?',
        isRequired: false,
        isCustomerFeature: false,
        hint: 'Please refer to your values from yesterday.',
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: createOptions(bloodSugar),
      },
      {
        displayOrder: 2,
        name: 'bloodSugarAfterMeal',
        label: 'What was your blood sugar in mg/dl 2 hours after meal?',
        isRequired: false,
        isCustomerFeature: false,
        hint: 'Please refer to your values from yesterday.',
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: createOptions(bloodSugar),
      },
      {
        displayOrder: 3,
        name: 'waterAmount',
        label: 'How many cups of water did you drink on average this week?',
        isRequired: false,
        isCustomerFeature: false,
        hint: `8oz per cup`,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: createOptions(waterAmount),
      },
      {
        displayOrder: 4,
        name: 'exerciseAmount',
        label: 'How much time in minutes did you spend exercising this week?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: createOptions(exerciseAmount),
      },
    ],
  },
];
