export type DiscoveryResFields = {
  field: {
    id: string;
    ref: string;
    type: string;
  };
  type: string;
  number?: number;
  choice?: { id: string; label: string; ref: string };
  choices?: { ids: string[]; labels: string[]; refs: string[] };
  text?: string;
  email?: string;
};

export type DiscoveryResponse = {
  a1c: string;
  a1cgoal: string;
  activelevel: string;
  age: number;
  diabetes: string;
  foodpalate: number;
  gender: string;
  height: number;
  medicalconditions: string;
  sweetorsavory: string;
  weight: number;
  allergies: string;
  tastePreferences: string[];
  email: string;
};

export type Step2Response = {
  carbsMacronutrients: number;
  proteinMacronutrients: number;
  fatMacronutrients: number;
};

export type Step3Response = {
  carbsPerMeal: number;
  proteinPerMeal: number;
  fatPerMeal: number;
  caloriePerMeal: number;
};

export type DiscoveryAllRes = {
  total_items: number;
  page_count: number;
  items: [
    {
      landing_id: string;
      token: string;
      response_id: string;
      landed_at: string;
      submitted_at: string;
      metadata: {
        user_agent: string;
        platform: string;
        referer: string;
        network_id: string;
        browser: string;
      };
      hidden: {
        typeformid: string;
      };
      answers: DiscoveryResFields[];
    },
  ];
};
