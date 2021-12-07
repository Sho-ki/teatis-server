export function calculateBMR(
  gender: string,
  age: number,
  height: number,
  weight: number,
) {
  let bmr: number;

  // inches to cm
  height = height * 2.54;

  // lb to kg
  weight = weight * 0.453592;

  if (gender === 'Male') {
    bmr = 66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age;
  } else {
    // if female or no answer
    bmr = 655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age;
  }
  return bmr;
}
