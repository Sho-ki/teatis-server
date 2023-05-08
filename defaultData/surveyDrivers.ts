import { SurveyQuestion, SurveyQuestionImage, SurveyQuestionOption } from '@prisma/client';

interface Survey {
  label:string;
  name:string;
  questions: Question[];
}

interface Question extends Omit<SurveyQuestion, 'id' | 'createdAt' | 'updatedAt'>{
  children?:Question[];
  displayOrder?:number;
  images?:Omit<SurveyQuestionImage, 'id' | 'createdAt' | 'updatedAt' | 'surveyQuestionId'>[];
  options:Omit<SurveyQuestionOption, 'id' | 'createdAt' | 'updatedAt' | 'surveyQuestionId'>[];
  isArchived: boolean;
}

const YesNoOptions = [
  {
    label: 'Yes',
    value: null,
    isArchived: false,
  },
  {
    label: 'No',
    value: null,
    isArchived: false,
  },
];
const dotExamNextOptions = [
  {
    label: 'Within a month',
    value: null,
    isArchived: false,
  },
  {
    label: 'Within 3 months',
    value: null,
    isArchived: false,
  },
  {
    label: 'Within 6 months',
    value: null,
    isArchived: false,
  },
  {
    label: 'Within a year',
    value: null,
    isArchived: false,
  },
  {
    label: 'Within 2 years',
    value: null,
    isArchived: false,
  },
];

const struggleOnRoadOptions = [
  {
    label: 'Meal prep and keep full on the road',
    value: null,
    isArchived: false,
  },
  {
    label: 'Take exercise',
    value: null,
    isArchived: false,
  },
  {
    label: 'Keep hydrated',
    value: null,
    isArchived: false,
  },
  {
    label: 'Control sleeping',
    value: null,
    isArchived: false,
  },
  {
    label: 'Manage stress',
    value: null,
    isArchived: false,
  },
  {
    label: 'Quit smoking',
    value: null,
    isArchived: false,
  },
];

const smokeOptions = [
  {
    label: 'Yes, I currently smoke',
    value: null,
    isArchived: false,
  },
  {
    label: 'No, but I used to smoke',
    value: null,
    isArchived: false,
  },
  {
    label: 'No, I have never smoked',
    value: null,
    isArchived: false,
  },
];

const A1COptions = [
  {
    label: '5',
    value: null,
    isArchived: false,
  },
  {
    label: '6',
    value: null,
    isArchived: false,
  },
  {
    label: '7',
    value: null,
    isArchived: false,
  },
  {
    label: '8',
    value: null,
    isArchived: false,
  },
  {
    label: '9',
    value: null,
    isArchived: false,
  },
  {
    label: '10',
    value: null,
    isArchived: false,
  },
  {
    label: '10+',
    value: null,
    isArchived: false,
  },
];

const areaOfPainOptions = [
  {
    label: 'Neck',
    value: null,
    isArchived: false,
  },
  {
    label: 'Shoulders',
    value: null,
    isArchived: false,
  },
  {
    label: 'Elbow',
    value: null,
    isArchived: false,
  },
  {
    label: 'Wrist',
    value: null,
    isArchived: false,
  },
  {
    label: 'Hands',
    value: null,
    isArchived: false,
  },
  {
    label: 'Upper Back',
    value: null,
    isArchived: false,
  },
  {
    label: 'Lower Back',
    value: null,
    isArchived: false,
  },
  {
    label: 'Hips',
    value: null,
    isArchived: false,
  },
  {
    label: 'Knees',
    value: null,
    isArchived: false,
  },
  {
    label: 'Ankles',
    value: null,
    isArchived: false,
  },
  {
    label: 'Feet',
    value: null,
    isArchived: false,
  },
];

const diabetesOptions = [
  {
    label: 'Type2',
    value: null,
    isArchived: false,
  },
  {
    label: 'Type1',
    value: null,
    isArchived: false,
  },
  {
    label: 'Prediabetes',
    value: null,
    isArchived: false,
  },
  {
    label: 'Gestational Diabetes',
    value: null,
    isArchived: false,
  },
  {
    label: 'Non-Diabetic',
    value: null,
    isArchived: false,
  },
  {
    label: 'I am not sure',
    value: null,
    isArchived: false,
  },
];

const timeOnRoadOptions = [
  {
    label: 'I spend most of my time on the truck',
    value: null,
    isArchived: false,
  },
  {
    label: 'I have time to go home on my shift',
    value: null,
    isArchived: false,
  },
  {
    label: 'It varies',
    value: null,
    isArchived: false,
  },
];

const foodDuringShiftOptions = [
  {
    label: 'I bring home cooked food',
    value: null,
    isArchived: false,
  },
  {
    label: 'I order food from outside',
    value: null,
    isArchived: false,
  },
  {
    label: 'I do both',
    value: null,
    isArchived: false,
  },
  {
    label: 'I don\'t eat during my shift',
    value: null,
    isArchived: false,
  },
];

const cgmDeviceOptions = [
  {
    label: 'The Contour Next One',
    value: null,
    isArchived: false,
  },
  {
    label: 'FreeStyle Libre',
    value: null,
    isArchived: false,
  },
  {
    label: 'Dexcom G6',
    value: null,
    isArchived: false,
  },
  {
    label: 'Eversense',
    value: null,
    isArchived: false,
  },
  {
    label: 'Guardian Connect System',
    value: null,
    isArchived: false,
  },
  {
    label: 'Walgreens TrueMetrix Bluetooth Blood Glucose Meter',
    value: null,
    isArchived: false,
  },
  {
    label: 'I don\'t use/own a CGM device',
    value: null,
    isArchived: false,
  },
  {
    label: 'Others',
    value: null,
    isArchived: false,
  },
];

const cookingToolsOnTruckOptions = [
  {
    label: 'Refrigerator',
    value: null,
    isArchived: false,
  },
  {
    label: 'Gas stove',
    value: null,
    isArchived: false,
  },
  {
    label: 'Pan',
    value: null,
    isArchived: false,
  },
  {
    label: 'Microwave',
    value: null,
    isArchived: false,
  },
];

const genderOptions = [
  {
    label: 'Female',
    value: null,
    isArchived: false,
  },
  {
    label: 'Male',
    value: null,
    isArchived: false,
  },
  {
    label: 'Prefer not to say',
    value: null,
    isArchived: false,
  },
];

const ageOptions = [
  {
    label: '~ 19',
    value: 15,
    isArchived: false,
  },
  {
    label: '20 ~ 29',
    value: 25,
    isArchived: false,
  },
  {
    label: '30 ~ 39',
    value: 35,
    isArchived: false,
  },
  {
    label: '40 ~ 49',
    value: 45,
    isArchived: false,
  },
  {
    label: '50 ~ 59',
    value: 55,
    isArchived: false,
  },
  {
    label: '60 ~ 69',
    value: 65,
    isArchived: false,
  },
  {
    label: '70 ~',
    value: 75,
    isArchived: false,
  },
];

const heightOptions = [
  {
    label: `~ 4'9`,
    value: 145,
    isArchived: false,
  },
  {
    label: `4'9 ~ 5'1`,
    value: 155,
    isArchived: false,
  },
  {
    label: `5'2 ~ 5'5`,
    value: 165,
    isArchived: false,
  },
  {
    label: `5'6 ~ 5'8`,
    value: 175,
    isArchived: false,
  },
  {
    label: `5'9 ~ 6'1`,
    value: 185,
    isArchived: false,
  },
  {
    label: `6'2 ~ 6'5`,
    value: 195,
    isArchived: false,
  },
  {
    label: `6'6 ~`,
    value: 205,
    isArchived: false,
  },
];

const weightOptions = [
  {
    label: '330 ~',
    value: 155,
    isArchived: false,
  },
  {
    label: '309 ~ 329',
    value: 145,
    isArchived: false,
  },
  {
    label: '287 ~ 308',
    value: 135,
    isArchived: false,
  },
  {
    label: '265 ~ 286',
    value: 125,
    isArchived: false,
  },
  {
    label: '243 ~ 264',
    value: 115,
    isArchived: false,
  },
  {
    label: '220 ~ 242',
    value: 105,
    isArchived: false,
  },
  {
    label: '198 ~ 219',
    value: 95,
    isArchived: false,
  },
  {
    label: '176 ~ 197',
    value: 85,
    isArchived: false,
  },
  {
    label: '154 ~ 175',
    value: 75,
    isArchived: false,
  },
  {
    label: '132 ~ 153',
    value: 65,
    isArchived: false,
  },
  {
    label: '~ 132',
    value: 55,
    isArchived: false,
  },
];

const seedSurveyDrivers:Survey =
  {
    name: 'driverPrePurchaseSurvey',
    label: 'Driver Pre Purchase Survey',
    questions: [
      {
        displayOrder: undefined,
        name: 'driversLicense',
        label: `Do you have Commercial Driver's License?`,
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: YesNoOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'dotExamNext',
        label: 'When will you be taking your next DOT exam?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: dotExamNextOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'struggleOnRoad',
        label: 'What do you struggle with on the road?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: struggleOnRoadOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'smoke',
        label: 'Do you smoke?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: smokeOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'A1C',
        label: 'What was your most recent A1C score?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: A1COptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'areaOfPain',
        label: 'Check off the areas where you are experiencing pain, weakness, or stiffness.',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'multiple',
        parentSurveyQuestionId: null,
        options: areaOfPainOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'diabetes',
        label: 'What stage of Diabetes are you in?',
        isRequired: false,
        isCustomerFeature: false,
        hint: ``,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: diabetesOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'insulinUsage',
        label: 'Do you take insulin as a cure for your diabetes?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: YesNoOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'timeOnRoad',
        label: 'Do you spend most of your time on the road or do you have time to go home on your shift?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: timeOnRoadOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'foodDuringShift',
        label: 'What do you typically eat during your shift?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: foodDuringShiftOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'cgmDevice',
        label: 'Which CGM device do you use?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: cgmDeviceOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'cookingToolsOnTruck',
        label: 'What cooking tools are available on your truck? (Select all that apply)',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'multiple',
        parentSurveyQuestionId: null,
        options: cookingToolsOnTruckOptions,
        isArchived: false,
      },

      {
        displayOrder: undefined,
        name: 'gender',
        label: 'How do you identify?',
        isRequired: false,
        isCustomerFeature: false,
        hint: `Providing your gender will help us to determine your optimal calorie intake.`,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: genderOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'age',
        label: 'How old are you?',
        isRequired: false,
        isCustomerFeature: false,
        hint: `Age helps us in calculate your metabolic rate.`,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: ageOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'height',
        label: 'How tall are you?',
        isRequired: false,
        isCustomerFeature: false,
        hint: 'Height helps us calculate your BMI.',
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: heightOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'weight',
        label: 'How much do you weigh?',
        isRequired: false,
        isCustomerFeature: false,
        hint: 'Weight helps us calculate your BMI.',
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: weightOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'bodyScale',
        label: 'Do you own a body scale?',
        isRequired: false,
        isCustomerFeature: false,
        hint: null,
        placeholder: null,
        responseType: 'single',
        parentSurveyQuestionId: null,
        options: YesNoOptions,
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'scienceBasedCurriculumForDrivers',
        label: 'Science-based curriculum',
        isRequired: false,
        isCustomerFeature: false,
        hint: `We suggest 1,000+ actions created by our clinical team. Each action is based on a holistic approach to wellness and tailored to fit your life on the road.`,
        placeholder: null,
        responseType: 'noResponse',
        parentSurveyQuestionId: null,
        images: [{ src: 'https://storage.googleapis.com/teatis-images/onboarding/teatis_anime_carrie-min.gif', position: 1 }],
        options: [],
        isArchived: true,
      },
      {
        displayOrder: undefined,
        name: 'solutionMentalCravingControl',
        label: 'Mental Craving Control',
        isRequired: false,
        isCustomerFeature: false,
        hint: 'You will gain access to talk to our dietitian. They will guide you through your struggles and questions!',
        placeholder: null,
        responseType: 'noResponse',
        parentSurveyQuestionId: null,
        images: [{ src: 'https://storage.googleapis.com/teatis-images/onboarding/teatis_anime_charlotte-min.gif', position: 1 }],
        options: [],
        isArchived: true,
      },
      {
        displayOrder: undefined,
        name: 'earnMilesWhileYouDrive',
        label: 'Earn Miles while you drive',
        isRequired: false,
        isCustomerFeature: false,
        hint: 'You will earn Miles for every healthy action you take. These Miles can be redeemed for cash back on fuel and auto parts.',
        placeholder: null,
        responseType: 'noResponse',
        parentSurveyQuestionId: null,
        images: [{ src: 'https://storage.googleapis.com/teatis-images/onboarding/teatis_anime_miranda-min.gif', position: 1 }],
        options: [],
        isArchived: true,
      },
      {
        displayOrder: undefined,
        name: 'benefitForDrivers',
        label: 'Benefit for drivers',
        isRequired: false,
        isCustomerFeature: false,
        hint: `You can reduce your A1c anywhere and anytime by changing your habits on the road. We never fail your CDL exams due to blood glucose.`,
        placeholder: null,
        responseType: 'noResponse',
        parentSurveyQuestionId: null,
        images: [{ src: 'https://storage.googleapis.com/teatis-images/onboarding/teatis_anime_samantha-min.gif', position: 1 }],
        options: [],
        isArchived: true,
      },
      {
        displayOrder: undefined,
        name: 'allergens',
        label: 'What kind of allergies do you have?',
        isRequired: false,
        isCustomerFeature: true,
        hint: null,
        placeholder: null,
        responseType: 'multiple',
        parentSurveyQuestionId: null,
        options: [],
        isArchived: true,
      },
      {
        displayOrder: undefined,
        name: 'ingredientDislikes',
        label: 'Which ingredients do you dislike?',
        isRequired: false,
        isCustomerFeature: true,
        hint: null,
        placeholder: null,
        responseType: 'multiple',
        parentSurveyQuestionId: null,
        options: [],
        isArchived: true,
        children: [
          {
            displayOrder: 1,
            name: 'ingredientDislikesOthers',
            label: 'What other ingredients do you dislike?',
            isRequired: false,
            isCustomerFeature: true,
            hint: null,
            placeholder: 'Search and add ingredients',
            responseType: 'multiple',
            parentSurveyQuestionId: null,
            options: [],
            isArchived: true,
          },
        ],
      },
      {
        displayOrder: undefined,
        name: 'email',
        label: `You've reached the end of the quiz!`,
        isRequired: true,
        isCustomerFeature: true,
        hint: 'Submit your email to create your profile!',
        placeholder: 'hi@teatismeal.com',
        responseType: 'text',
        parentSurveyQuestionId: null,
        options: [],
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'name',
        label: 'What is your name?',
        isRequired: true,
        isCustomerFeature: true,
        hint: null,
        placeholder: null,
        responseType: 'text',
        parentSurveyQuestionId: null,
        options: [],
        isArchived: false,
      },
      {
        displayOrder: undefined,
        name: 'phoneNumber',
        label: 'What is your phone number?',
        isRequired: true,
        isCustomerFeature: true,
        hint: null,
        placeholder: null,
        responseType: 'text',
        parentSurveyQuestionId: null,
        options: [],
        isArchived: false,
      },
    ],
  };

seedSurveyDrivers.questions.forEach((question, i) => {
  question.displayOrder = i + 1;
});

export default seedSurveyDrivers;
