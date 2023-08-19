export const sum = (array) => {
  if (!array || array.length === 0) {
    return 0;
  }

  const sum = array.reduce((accum, item) => {
    return accum + item;
  }, 0);

  return sum;
};

export const average = (array, callback) => {
  if (!array || array.length === 0) {
    return 0;
  }

  const sum = array.reduce((accum, item) => {
    return typeof callback === 'function'
      ? callback(accum, item)
      : accum + item;
  }, 0);

  return sum / array.length;
};

export const min = (array) => {
  let min = 100;
  let minIndex = 0;

  if (!array || array.length === 0) {
    return min;
  }

  array.forEach((item, index) => {
    if (item < min) {
      min = item;
      minIndex = index;
    }
  });

  return { min, index: minIndex };
};

export const max = (array) => {
  let max = 0;
  let maxIndex = 0;

  if (!array || array.length === 0) {
    return max;
  }

  array.forEach((item, index) => {
    if (item > max) {
      max = item;
      maxIndex = index;
    }
  });

  return { max, index: maxIndex };
};
