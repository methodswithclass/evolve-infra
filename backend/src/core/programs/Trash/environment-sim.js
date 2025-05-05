import { getActionById } from "../../../utils/utils";

const hasTrash = (rate) => {
  return Math.random() < rate;
};

export const createRandomGrid = (input) => {
  const { width, height, trashRate } = input;

  const state = [];
  let row = [];

  for (let j = 0; j < height; j++) {
    row = [];
    for (let i = 0; i < width; i++) {
      row[i] = hasTrash(trashRate) ? 1 : 0;
    }
    state[j] = row;
  }

  return state;
};

const check = (grid, { x, y }) => {
  if (x < 0 || x > grid[0].length - 1 || y < 0 || y > grid.length - 1) {
    return 2;
  }

  return grid[y][x] === 1 ? 1 : 0;
};

const assess = ({ grid, robot }) => {
  const base = 3;
  const i = robot.x;
  const j = robot.y;

  console.log("debug assess", grid, robot);

  const options = [
    check(grid, { x: i, y: j - 1 }),
    check(grid, { x: i, y: j + 1 }),
    check(grid, { x: i - 1, y: j }),
    check(grid, { x: i + 1, y: j }),
    check(grid, { x: i, y: j }),
  ];

  const index = options.reduce((accum, item, index) => {
    return accum + item * Math.pow(base, index);
  }, 0);

  console.log("debug index", index);

  return index;
};

const move = ({ diff, robot, grid }) => {
  console.log("debug move", robot, diff);
  const size = { x: grid[0].length, y: grid.length };

  const newPos = { x: robot.x + diff.x, y: robot.y + diff.y };

  if (
    newPos.x < 0 ||
    newPos.x > size.x - 1 ||
    newPos.y < 0 ||
    newPos.y > size.y - 1
  ) {
    return { robot, result: "fail" };
  }

  robot = newPos;

  console.log("debug new pos", newPos);

  return { robot, result: "success" };
};

const clean = ({ grid, robot }) => {
  const block = grid[robot.y][robot.x];

  if (block === 1) {
    grid[robot.y][robot.x] = 2;
    return { grid, result: "success" };
  }

  return { grid, result: "fail" };
};

export const step = (input) => {
  const { grid, robot, dna } = input;
  const state = assess({ grid, robot });
  const id = dna[state];
  const action = getActionById(id);
  console.log("debug step", state, id, action, dna);
  let outcome;
  if (action.name === "clean") {
    outcome = clean({ grid, robot });
  } else {
    const diff = action.change();
    outcome = move({ diff, robot, grid });
  }

  return { ...input, ...outcome, action };
};
