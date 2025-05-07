import Environment from "./environment";
import Robot from "./robot";
import { createRandomGrid, step } from "./environment-sim";
import { average } from "../../../utils/utils";
import { actions } from "../../../utils/utils";

const getTrashProgram = (options) => {
  const { totalSteps, geneTotal } = options;

  const Runs = (input) => {
    const { strategy, size, totalRuns, trashRate, start, index } = input;

    const { steps } = strategy;

    const create = (i) => {
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
    const { robot } = input;
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
    // const getRand = (max, min = 0) => {
    //   return Math.floor(Math.random() * (max - min)) + min;
    // };

    // const lenMax = 12;
    // const lenMin = 2;
    // const segNumMax = Math.floor(popTotal / lenMax / 2);
    // const segNumMin = 5;

    // const segNum = getRand(segNumMax, segNumMin);

    // const tempDna = [...dna];

    // for (let i = 0; i < segNum; i++) {
    //   const rand = getRand(popTotal);
    //   const len = getRand(lenMax, lenMin);
    //   const segment = otherDna.slice(rand, rand + len);

    //   tempDna.splice(rand, len, ...segment);
    // }

    // const limitDna = tempDna.slice(0, dna.length);
    // const rest = dna.slice(limitDna.length, dna.length) || [];

    // const newDna = [...limitDna, ...rest];
    // return newDna;

    return dna.map((gene, index) => {
      return Math.random() < 0.5 ? gene : otherDna[index];
    });
  };

  const combine = (a, b) => {
    const { dna, steps } = a;
    const { dna: otherDna } = b;

    const newDna = combineDna(dna, otherDna);

    return { dna: newDna, steps };
  };

  const simulate = (input) => {
    const { result, action, ...rest } = step(input);
    return { result, action, points: action.points[result], ...rest };
  };

  const create = ({ size, trashRate }) => {
    return {
      grid: createRandomGrid({ size, trashRate }),
      robot: { x: 0, y: 0 },
    };
  };

  return { mutate, getFitness, combine, simulate, create };
};

export default getTrashProgram;
