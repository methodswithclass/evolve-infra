export const sum = (array) => {
  const sum = array.reduce((accum, item) => {
    return accum + item;
  }, 0);

  return sum;
};

export const average = (array) => {
  const total = sum(array);

  return total / array.length;
};
