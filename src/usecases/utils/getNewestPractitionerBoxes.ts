import { PractitionerBox } from '@Domains/PractitionerBox';

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
