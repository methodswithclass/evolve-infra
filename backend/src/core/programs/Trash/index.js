import Environment from "./environment";
import Robot from "./robot";
import { average, getActionById } from "../../../utils/utils";
import { actions } from "../../../utils/constants";

const hasTrash = (rate) => {
  return Math.random() < rate;
};

const createRandomGrid = (input) => {
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
    return "fail";
  }

  robot = newPos;

  console.log("debug new pos", newPos);

  return "success";
};

const clean = ({ grid, robot }) => {
  const block = grid[robot.y][robot.x];

  if (block === 1) {
    grid[robot.y][robot.x] = 2;
    return "success";
  }

  return "fail";
};

const step = (input) => {
  const { grid, robot, dna } = input;
  const state = assess({ grid, robot });
  const id = dna[state];
  const action = getActionById(id);
  console.log("debug step", state, id, action, dna);
  let result = "fail";
  if (action.name === "clean") {
    result = clean({ grid, robot });
  } else {
    const diff = action.change();
    result = move({ diff, robot, grid });
  }

  return { ...input, result, action, robot, grid };
};

const Runs = (input) => {
  const { strategy, size, totalRuns, trashRate, start, index } = input;

  const { steps } = strategy;

  const create = (i) => {
    // const grid = createRandomGrid({ width, height, trashRate });
    // const robot = { x: 0, y: 0 };
    // return { grid, robot };
    const env = new Environment({ size, condition: trashRate });
    const robot = new Robot({
      env,
      start,
      total: steps,
      index: `${index}#${i}`,
    });
    return robot;
  };

  const robots = [];

  for (let i = 0; i < totalRuns; i++) {
    robots.push(create(i));
  }

  return robots;
};

const performStep = (input) => {
  const { robot, step } = input;
  const { result, action } = robot.update();
  return action.points[result];
};

const performRun = async (input) => {
  const { robot, dna, run } = input;

  robot.instruct(dna);

  const total = robot.getTotal();

  let fit = 0;

  return new Promise((resolve) => {
    for (let i = 0; i < total; i++) {
      fit += performStep({ ...input, run, step: i });
    }

    resolve(fit);
  });
};

const getTrashProgram = (options) => {
  const { totalSteps, popTotal, geneTotal } = options;

  const simulate = (input) => {
    const { result, action, ...rest } = step(input);
    return { result, action, fit: action.points[result], ...rest };
  };

  const create = ({ width, height, trashRate }) => {
    return {
      grid: createRandomGrid({ width, height, trashRate }),
      robot: { x: 0, y: 0 },
    };
  };

  const getFitness = async (input) => {
    const { strategy } = input;

    if (!strategy) {
      return 0;
    }

    const { dna } = strategy;

    const robots = Runs({ ...input, ...options });

    const promises = robots.map(async (robot, index) => {
      const result = await performRun({
        ...input,
        ...options,
        dna,
        robot,
        run: index,
      });
      return result;
    });

    const fits = await Promise.all(promises);

    const fit = average(fits);

    return fit;
  };

  const getGene = () => {
    const value = Math.floor(Math.random() * actions.length);
    return value;
  };

  const mutate = async (strategy) => {
    const newDna = [];

    if (!strategy) {
      for (let i = 0; i < geneTotal; i++) {
        newDna.push(getGene());
      }

      return { dna: newDna, steps: totalSteps };
    }

    const { dna, steps } = strategy;

    const mutatedDna = dna.map((item) => {
      if (Math.random() < 0.02) {
        return getGene();
      }

      return item;
    });

    return { dna: mutatedDna, steps };
  };

  const combineDna = (dna, otherDna) => {
    const getRand = (max, min = 0) => {
      return Math.floor(Math.random() * (max - min)) + min;
    };

    const lenMax = 12;
    const lenMin = 2;
    const segNumMax = Math.floor(popTotal / lenMax / 2);
    const segNumMin = 5;

    const segNum = getRand(segNumMax, segNumMin);

    const tempDna = [...dna];

    for (let i = 0; i < segNum; i++) {
      const rand = getRand(popTotal);
      const len = getRand(lenMax, lenMin);
      const segment = otherDna.slice(rand, rand + len);

      tempDna.splice(rand, len, ...segment);
    }

    const limitDna = tempDna.slice(0, dna.length);
    const rest = dna.slice(limitDna.length, dna.length) || [];

    const newDna = [...limitDna, ...rest];
    return newDna;
  };

  const combine = (a, b) => {
    const { dna, steps } = a;
    const { dna: otherDna } = b;

    const newDna = combineDna(dna, otherDna);

    return { dna: newDna, steps };
  };

  return { mutate, getFitness, combine, simulate, create };
};

export default getTrashProgram;
