export function calculateAddedAndDeletedNumbers(
  existingNumbers: number[],
  newNumbers: number[],
): [number[], number[]] {
  const existingNumberSet = new Set(existingNumbers);
  const newNumberSet = new Set(newNumbers);

  const numbersToDelete = existingNumbers.filter(
    (number) => !newNumberSet.has(number),
  );
  // Delete

  const numbersToAdd = newNumbers.filter(
    (number) => !existingNumberSet.has(number),
  );
  // Add
  return [numbersToAdd, numbersToDelete];
}
