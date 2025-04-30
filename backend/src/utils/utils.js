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
    return typeof callback === "function"
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

const posMap = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  here: { x: 0, y: 0 },
};

const getRandomMove = () => {
  var test = Math.random();

  if (test < 0.25) {
    return posMap["up"];
  } else if (test < 0.5) {
    return posMap["down"];
  } else if (test < 0.75) {
    return posMap["left"];
  } else {
    return posMap["right"];
  }
};

export const getActionById = (id) => {
  const action = actions.find((item) => item.id === id);

  return action;
};

export const actions = [
  {
    id: 0,
    name: "up",
    title: "move up",
    change: () => {
      return posMap["up"];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 1,
    name: "down",
    title: "move down",
    change: () => {
      return posMap["down"];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 2,
    name: "left",
    title: "move left",
    change: () => {
      return posMap["left"];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 3,
    name: "right",
    title: "move right",
    change: () => {
      return posMap["right"];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 4,
    name: "random",
    title: "move random",
    change: getRandomMove,
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 5,
    name: "stay",
    title: "stay in place",
    change: () => {
      return posMap["here"];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 6,
    name: "clean",
    title: "clean trash",
    change: () => {
      return posMap["here"];
    },
    points: {
      success: 10,
      fail: -5,
    },
  },
];
