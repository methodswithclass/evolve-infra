import Environment from './environment';
import Robot, { actions } from './robot';
import { average } from '../../../utils/utils';

const Runs = (input) => {
  const { size, condition, totalRuns, start, index, beginActions } = input;

  const create = (i) => {
    const env = new Environment({ size, condition, beginActions });
    const robot = new Robot({ env, start, index: `${index}#${i}` });
    return robot;
  };

  const robots = [];

  for (let i = 0; i < totalRuns; i++) {
    robots.push(create(i));
  }

  return robots;
};

const performStep = (input) => {
  const { robot, index, run, step } = input;
  const { result, action } = robot.update();
  return action.points[result];
};

const performRun = (input) => {
  const { robot, dna, total, index, run } = input;

  robot.instruct(dna);

  let fit = 0;

  return new Promise((resolve) => {
    for (let i = 0; i < total; i++) {
      fit += performStep({ ...input, run, step: i });
    }

    resolve(fit);
  });
};

const getTrashProgram = (options) => {
  const {
    beginActions,
    totalSteps,
    popTotal,
    geneTotal,
    fitType = 'total',
  } = options;

  const getFitness = async (input) => {
    const { strategy } = input;

    if (!strategy) {
      return 0;
    }

    const { dna, steps } = strategy;

    const robots = Runs({ ...input, ...options });

    const promises = robots.map((robot, index) => {
      return performRun({
        ...input,
        ...options,
        dna,
        total: steps?.length > 0 ? average(steps) : totalSteps,
        robot,
        run: index,
      });
    });

    const fits = await Promise.all(promises);

    return average(fits);
  };

  const getGene = () => {
    const value = Math.floor(Math.random() * actions.length);
    return value;
  };

  const getSteps = () => {
    return Math.floor(Math.random() * totalSteps) + 20;
  };

  const mutate = async (strategy) => {
    const newDna = [];
    const newSteps = [];

    if (!strategy) {
      for (let i = 0; i < geneTotal; i++) {
        newDna.push(getGene());
      }

      for (let i = 0; i < beginActions; i++) {
        newSteps.push(getSteps());
      }

      return { dna: newDna, steps: newSteps };
    }

    const { dna, steps } = strategy;

    const mutatedDna = dna.map((item) => {
      if (Math.random() < 0.02) {
        return getGene();
      }

      return item;
    });

    const mutatedSteps = steps.map((item) => {
      if (Math.random() < 0.02) {
        return getSteps();
      }

      return item;
    });

    return { dna: mutatedDna, steps: mutatedSteps };
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

    const newDna = tempDna.slice(0, dna.length);
    return newDna;
  };

  const combineSteps = (steps, otherSteps) => {
    return steps.map((item, index) => {
      return index % 2 === 0 ? steps[index] : otherSteps[index];
    });
  };

  const combine = (a, b) => {
    const { dna, steps } = a;
    const { dna: otherDna, steps: otherSteps } = b;

    const newDna = combineDna(dna, otherDna);
    const newSteps = combineSteps(steps, otherSteps);

    return { dna: newDna, steps: newSteps };
  };

  return { mutate, getFitness, combine };
};

export default getTrashProgram;
