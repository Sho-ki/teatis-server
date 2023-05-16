import { MicroGoalCategoryTypes, MicroGoalSubCategoryTypes } from '../src/shared/constants/microGoalCategories';

interface MicroGoalCategoryList {
    name: string;
    label: string;
    subcategories?: MicroGoalSubCategoryList[];
}

interface MicroGoalSubCategoryList {
    name: string;
    label: string;
}

function enumToLabel(enumValue: string): string {
  return enumValue
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const microGoalCategories: MicroGoalCategoryList[] = [
  {
    name: MicroGoalCategoryTypes.Food,
    label: enumToLabel(MicroGoalCategoryTypes.Food),
    subcategories: [
      {
        name: MicroGoalSubCategoryTypes.TipsFood,
        label: enumToLabel(MicroGoalSubCategoryTypes.TipsFood),
      },
    ],
  },
  {
    name: MicroGoalCategoryTypes.Stress,
    label: enumToLabel(MicroGoalCategoryTypes.Stress),
    subcategories: [
      {
        name: MicroGoalSubCategoryTypes.TipsStress,
        label: enumToLabel(MicroGoalSubCategoryTypes.TipsStress),
      },
    ],
  },
  {
    name: MicroGoalCategoryTypes.Hydration,
    label: enumToLabel(MicroGoalCategoryTypes.Hydration),
    subcategories: [
      {
        name: MicroGoalSubCategoryTypes.SugarFreeDrinks,
        label: enumToLabel(MicroGoalSubCategoryTypes.SugarFreeDrinks),
      },
      {
        name: MicroGoalSubCategoryTypes.Water,
        label: enumToLabel(MicroGoalSubCategoryTypes.Water),
      },
    ],
  },
  {
    name: MicroGoalCategoryTypes.A1C,
    label: enumToLabel(MicroGoalCategoryTypes.A1C),
    subcategories: [
      {
        name: MicroGoalSubCategoryTypes.TipsA1c,
        label: enumToLabel(MicroGoalSubCategoryTypes.TipsA1c),
      },
    ],
  },
  {
    name: MicroGoalCategoryTypes.Exercise,
    label: enumToLabel(MicroGoalCategoryTypes.Exercise),
    subcategories: [
      {
        name: MicroGoalSubCategoryTypes.TipsExercise,
        label: enumToLabel(MicroGoalSubCategoryTypes.TipsExercise),
      },
      {
        name: MicroGoalSubCategoryTypes.Legs,
        label: enumToLabel(MicroGoalSubCategoryTypes.Legs),
      },
      {
        name: MicroGoalSubCategoryTypes.Arms,
        label: enumToLabel(MicroGoalSubCategoryTypes.Arms),
      },
      {
        name: MicroGoalSubCategoryTypes.Neck,
        label: enumToLabel(MicroGoalSubCategoryTypes.Neck),
      },
    ],
  },
];

export default microGoalCategories;
