import Environment from './environment';
import Robot, { actions, outcomes } from './robot';
import { average, sum, max } from '../../../utils/utils';

const Runs = (params) => {
  const { size, condition, totalRuns, start, index, beginActions } = params;

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

const processOutcomes = ({ accum = 0, result, count = 'none', action }) => {
  Object.entries(outcomes).forEach(([outcome, names]) => {
    if (outcome === 'success') {
      switch (result) {
        case names[0]: // cleaned
          if (action) {
            accum += action.points.success;
            break;
          }
          accum += count === 0 ? -100 : count * 10;
          break;
        case names[1]: // moved
          // points = accum + (count !== 'none' && count > 100 ? count * -5 : 0);
          break;
        default:
      }
    } else if (outcome === 'fail') {
      switch (result) {
        case names[0]: // wall
          if (action) {
            accum += action.points.fail;
            break;
          }
          accum += count < 3 ? 100 : count * -5;
          break;
        case names[1]: // notDirty
          if (action) {
            accum += action.points.fail;
            break;
          }
          accum += count < 3 ? 100 : count * -5;
          break;
        case names[2]: // stillDirty
          break;
        default:
      }
    }
  });

  return accum;
};

const performStepByTotal = (params) => {
  const { robot, index, fit, run, step } = params;

  const { result, action } = robot.update();

  const { total = 0 } = fit;

  // console.log('debug step', index, run, step, total);

  fit.total = processOutcomes({ accum: total, result, action });

  // console.log('debug step', index, run, step, fit.total);
};

const performStepByResult = (params) => {
  const { robot, fit } = params;

  const { action, result } = robot.update();

  if (!fit[result]) {
    fit[result] = [];
  }

  fit[result].push(action);
};

const performRun = (params) => {
  const { robot, dna, beginActions, index, run, performStep } = params;

  return new Promise((resolve) => {
    robot.instruct(dna);

    let fit = {};

    for (let i = 0; i < average(dna.slice(0, beginActions)); i++) {
      performStep({ ...params, fit, run, step: i });
    }

    // console.log('debug run', index, run, fit);

    if (Number.isInteger(fit.total)) {
      resolve(fit);
      return;
    }

    const fitObj = Object.entries(fit).reduce((accum, [key, value]) => {
      return { ...accum, [key]: { count: value.length, action: value[0] } };
    }, {});

    resolve(fitObj);
  });
};

const processRuns = (params, fits, fn) => {
  const { index } = params;
  if (Number.isInteger(fits[0].total)) {
    const totalFit = fits.map((fit) => {
      // console.log('debug fit', index, fit);
      return fit.total;
    });

    return fn(totalFit);
  }

  const totalFit = fits.reduce((accum, fit) => {
    Object.entries(fit).forEach(([result, value]) => {
      const { count } = value;
      if (!accum[result]) {
        accum[result] = [];
      }
      accum[result].push(count);
    });
    return accum;
  }, {});

  const finalFit = Object.entries(totalFit).reduce((accum, [result, fit]) => {
    const count = fn(fit);
    // console.log('debug result', index, result, count, accum);
    return processOutcomes({ accum, result, count });
  }, 0);

  return finalFit;
};

const getTrashProgram = (options) => {
  const { beginActions, totalSteps, fitType = 'total' } = options;

  const run = async (params) => {
    const robots = Runs(params);

    const promises = robots.map((robot, index) => {
      return performRun({
        ...params,
        performStep:
          fitType === 'total' ? performStepByTotal : performStepByResult,
        robot,
        run: index,
      });
    });

    const fits = await Promise.all(promises);

    return processRuns(params, fits, average);
  };

  const getGene = (index) => {
    if (index < beginActions) {
      return Math.floor(Math.random() * totalSteps) + 20;
    }
    return Math.floor(Math.random() * actions.length);
  };

  return { getGene, run };
};

export default getTrashProgram;
