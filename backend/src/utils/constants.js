export const posMap = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  here: { x: 0, y: 0 },
};

const getRandomMove = () => {
  return { x: Math.random() < 0.5 ? 1 : -1, y: Math.random() < 0.5 ? 1 : -1 };
};

export const actions = [
  {
    id: 0,
    name: "up",
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
    change: getRandomMove,
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 5,
    name: "stay",
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
    change: () => {
      return posMap["here"];
    },
    points: {
      success: 10,
      fail: -5,
    },
  },
];
