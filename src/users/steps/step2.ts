export function calculateMacronutrients(bmr: number, activeLevel: string) {
  let macronutrientsObj = {};
  switch (activeLevel) {
    case 'Very active (3-4 times per week)':
      macronutrientsObj['carbs'] = (bmr * 0.45) / 4;
      macronutrientsObj['protein'] = (bmr * 0.35) / 4;
      macronutrientsObj['fat'] = (bmr * 0.2) / 4;
      break;
    case 'Moderately active (1-2 times per week)':
      macronutrientsObj['carbs'] = (bmr * 0.4) / 4;
      macronutrientsObj['protein'] = (bmr * 0.35) / 4;
      macronutrientsObj['fat'] = (bmr * 0.25) / 4;
      break;
    case 'Not active':
      macronutrientsObj['carbs'] = (bmr * 0.35) / 4;
      macronutrientsObj['protein'] = (bmr * 0.35) / 4;
      macronutrientsObj['fat'] = (bmr * 0.3) / 4;
      break;
    default:
      // if no answer
      macronutrientsObj['carbs'] = (bmr * 0.4) / 4;
      macronutrientsObj['protein'] = (bmr * 0.35) / 4;
      macronutrientsObj['fat'] = (bmr * 0.25) / 4;
      break;
  }
  return {
    carbsMacronutrients: macronutrientsObj['carbs'],
    proteinMacronutrients: macronutrientsObj['protein'],
    fatMacronutrients: macronutrientsObj['fat'],
  };
}
