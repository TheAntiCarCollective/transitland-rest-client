import * as assert from "node:assert";

export const shuffle = <T>(array: T[]) => {
  array = [...array];
  const { length: numberOfElements } = array;

  for (let index = numberOfElements - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const randomElement = array[randomIndex];
    assert(randomElement !== undefined);

    const element = array[index];
    assert(element !== undefined);

    array[index] = randomElement;
    array[randomIndex] = element;
  }

  return array;
};

export const sample = <T>(array: T[], count: number) => {
  count = Math.max(count, 0);
  const { length: numberOfElements } = array;
  count = Math.min(count, numberOfElements);

  array = shuffle(array);
  return array.slice(0, count);
};
