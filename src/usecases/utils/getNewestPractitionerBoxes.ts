import { PractitionerBox } from '@Domains/PractitionerBox';
import { nextMonth } from './dates';

export const filterDuplicatePractitionerBox = (
  allPractitionerBoxes: PractitionerBox[],
): PractitionerBox[] => {
  const newestPractitionerBoxes: PractitionerBox[] = allPractitionerBoxes.filter((value, index, self) =>
    index === self.findIndex(element => (
      value.practitionerId === element.practitionerId
    ))
  );
  return newestPractitionerBoxes;
};

export const unkokko = (
  allPractitionerBoxes: PractitionerBox[]
): [PractitionerBox[], PractitionerBox[]] => {
  const updatedPractitionerBoxLabel = `Recurring___${nextMonth()}___`;
  const updatedPractitionerBox: PractitionerBox[] = allPractitionerBoxes
    .filter(practitionerBox => practitionerBox.label.includes(updatedPractitionerBoxLabel));
  const outdatedPractitionerBox: PractitionerBox[] = allPractitionerBoxes
    .filter(practitionerBox => !practitionerBox.label.includes(updatedPractitionerBoxLabel));
  return [updatedPractitionerBox, outdatedPractitionerBox];
};
