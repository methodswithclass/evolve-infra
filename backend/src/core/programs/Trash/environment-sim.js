import { getActionById } from "../../../utils/utils";

const hasTrash = (rate) => {
  return Math.random() < rate;
};

export const createRandomGrid = (input) => {
  const { width, height, trashRate } = input;

  const state = [];
  let row = [];

  for (let i = 0; i < height; i++) {
    row = [];
    for (let j = 0; j < width; j++) {
      row.push(hasTrash(trashRate) ? 1 : 0);
    }
    state.push(row);
  }

  return state;
};

const assess = ({ grid, robot }) => {
  const base = 3;
  const i = robot.y;
  const j = robot.x;

  console.log("debug assess", grid, robot);

  const top = i === 0 ? 2 : grid[i - 1][j] === 0 ? 0 : 1;
  const bottom = i === grid.length - 1 ? 2 : grid[i + 1][j] === 0 ? 0 : 1;
  const left = j === 0 ? 2 : grid[i][j - 1] === 0 ? 0 : 1;
  const right = j === grid[i].length - 1 ? 2 : grid[i][j + 1] === 0 ? 0 : 1;
  const block = grid[i][j];

  const options = [top, bottom, left, right, block];

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
