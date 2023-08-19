import Environment from './environment';
import Robot, { actions } from './robot';
import { average, max } from '../../../utils/utils';

const Runs = (input) => {
  const { strategy, size, totalRuns, condition, start, index } = input;

  const { steps } = strategy;

  const totalLength = totalRuns;

  const create = (i) => {
    const total = average(steps);

    const env = new Environment({ size, condition });
    const robot = new Robot({ env, start, total, index: `${index}#${i}` });
    return robot;
  };

  const robots = [];

  for (let i = 0; i < totalLength; i++) {
    robots.push(create(i));
  }

  return robots;
};

const performStep = (input) => {
  const { robot } = input;
  const { result, action } = robot.update();
  return action.points[result];
};

const performRun = (input) => {
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
  const { beginActions, totalSteps, popTotal, geneTotal } = options;

  const getFitness = async (input) => {
    const { strategy } = input;

    if (!strategy) {
      return { steps: 0, fit: 0 };
    }

    const { dna, steps } = strategy;

    const robots = Runs({ ...input, ...options });

    const promises = robots.map((robot, index) => {
      return performRun({
        ...input,
        ...options,
        dna,
        robot,
        run: index,
      });
    });

    const fits = await Promise.all(promises);

    const callback = (accum, item) => {
      const { fit: fitness, steps } = item;

      let points = fitness;

      if (Math.abs(50 - steps) < 0.1) {
        points += 50;
      } else {
        points -= 20;
      }

      return accum + points;
    };

    const fit = average(fits);
    const averageSteps = average(steps);

    return { fit, steps: averageSteps };
  };

  const rank = (a, b) => {
    const fitRank = b.fit - a.fit;

    return fitRank;
  };

  const getGene = () => {
    const value = Math.floor(Math.random() * actions.length);
    return value;
  };

  const getSteps = () => {
    return Math.floor(Math.random() * totalSteps) + 20;
    // return 50;
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

    const limitDna = tempDna.slice(0, dna.length);
    const rest = dna.slice(limitDna.length, dna.length) || [];

    const newDna = [...limitDna, ...rest];
    return newDna;
  };

  const combineSteps = (steps, otherSteps) => {
    return steps.map((item, index) => {
      return index % 2 === 0 ? item : otherSteps[index];
    });
  };

  const combine = (a, b) => {
    // console.log('debug combine', a, b);
    const { dna, steps } = a;
    const { dna: otherDna, steps: otherSteps } = b;

    const newDna = combineDna(dna, otherDna);
    const newSteps = combineSteps(steps, otherSteps);

    return { dna: newDna, steps: newSteps };
  };

  return { mutate, getFitness, combine, rank };
};

export default getTrashProgram;
