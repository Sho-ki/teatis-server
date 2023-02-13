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

export const weeklyCheckIn:Survey[] = [
  {
    name: 'weeklyCheckIn',
    label: 'Weekly Check-in',
    questions: [
      {
        displayOrder: 1,
        name: 'glucoseLevel',
        label: 'How often do you eat snacks?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: [
          {
            label: 'More than once a day',
            value: null,
            isArchived: false,
          },
          {
            label: 'Once a day',
            value: null,
            isArchived: false,
          },
          {
            label: 'Few times a week',
            value: null,
            isArchived: false,
          },
          {
            label: 'Less than once a week',
            value: null,
            isArchived: false,
          },
        ],
      },
      {
        displayOrder: 2,
        name: 'waterAmount',
        label: 'How much water did you drink on average this week?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: [
          {
            label: 'Less than 6 cups',
            value: null,
            isArchived: false,
          },
          {
            label: '6~8 cups',
            value: null,
            isArchived: false,
          },
          {
            label: 'More than 8 cups',
            value: null,
            isArchived: false,
          },
        ],
      },
      {
        displayOrder: 3,
        name: 'exerciseAmount',
        label: 'How much time did you spend exercising this week?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: [
          {
            label: 'More than once a day',
            value: null,
            isArchived: false,
          },
          {
            label: 'Once a day',
            value: null,
            isArchived: false,
          },
          {
            label: 'Few times a week',
            value: null,
            isArchived: false,
          },
          {
            label: 'Less than once a week',
            value: null,
            isArchived: false,
          },
        ],
      },
    ],
  },
];
