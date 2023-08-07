export const sum = (array) => {
  if (!array || array.length === 0) {
    return 0;
  }

  const sum = array.reduce((accum, item) => {
    return accum + item;
  }, 0);

  return sum;
};

export const average = (array) => {
  if (!array || array.length === 0) {
    return 0;
  }

  const total = sum(array);

  return total / array.length;
};

export const min = (array) => {
  let min = 100;

  if (!array || array.length === 0) {
    return min;
  }

  array.forEach((item) => {
    if (item < min) {
      min = item;
    }
  });

  return min;
};

export const max = (array) => {
  let max = 0;

  if (!array || array.length === 0) {
    return max;
  }

  array.forEach((item) => {
    if (item > max) {
      max = item;
    }
  });

  return max;
};

export const overrideConsole = () => {
  const console = {
    log: () => {},
    warn: () => {},
    error: () => {},
  };
  window.console = console;
};
