import Environment from './environment';
import Robot, { actions } from './robot';
import { average } from '../../../utils/utils';

const Runs = (params) => {
  const { size, condition, totalRuns, index } = params;

  const create = (i) => {
    const env = new Environment({ size, condition });
    const robot = new Robot({ env, index: `${index}#${i}` });
    return robot;
  };

  const robots = [];

  for (let i = 0; i < totalRuns; i++) {
    robots.push(create(i));
  }

  return robots;
};

const performStep = (params) => {
  const { robot } = params;

  const { action, result } = robot.update();

  const points =
    result === 'success' ? action.points.success : action.points.fail;

  return points;
};

const performRun = (params) => {
  const { totalSteps, robot, dna } = params;

  return new Promise((resolve) => {
    robot.instruct(dna);

    let fit = 0;

    for (let i = 0; i < totalSteps; i++) {
      fit += performStep({ ...params, step: i });
    }

    resolve(fit);
  });
};

const run = async (params) => {
  const robots = Runs(params);

  const promises = robots.map((robot, index) => {
    return performRun({ ...params, robot, run: index });
  });

  const fits = await Promise.all(promises);

  return average(fits);
};

const getGene = () => {
  return Math.floor(Math.random() * actions.length);
};

export default { getGene, run };
