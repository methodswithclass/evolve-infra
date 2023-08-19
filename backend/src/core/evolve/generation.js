import Individual from './individual';
import { v4 as uuid } from 'uuid';

const TIMEOUT = 'TimeoutException';

const defaultRank = (a, b) => {
  return b - a;
};

function Generation(input) {
  const self = this;

  const {
    pop = [],
    epoch = 1,
    best = null,
    popTotal = 100,
    rank: userRank = defaultRank,
  } = input || {};

  const total = popTotal;
  const topPercent = 0.1;
  const parents = { a: [], b: [] };
  let _pop = pop || [];
  let _isSorted = false;
  let _active = false;
  let _timeout = null;
  const id = uuid();

  const rank = (a, b) => {
    return userRank(a, b);
  };

  const getRandomIndex = () => {
    return Math.floor(Math.random() * total * topPercent);
  };

  const getAnotherIndex = (first) => {
    const second = getRandomIndex();

    if (first === second) {
      return getAnotherIndex(first);
    }

    return second;
  };

  const getRandomParents = () => {
    for (let index = 0; index < total; index++) {
      const first = getRandomIndex();
      const second = getAnotherIndex(first);

      parents.a[index] = first;
      parents.b[index] = second;
    }
  };

  const init = async () => {
    if (_pop.length === 0) {
      for (let index = 0; index < total; index++) {
        const newInd = new Individual({
          epoch,
          strategy: best?.strategy,
          gen: id,
          index,
          ...input,
        });

        await newInd.isReady();

        _pop[index] = newInd;
      }
    } else {
      _pop.forEach((item) => {
        item.setGen(id);
      });
    }

    getRandomParents();

    _active = true;
  };

  init().catch((error) => {
    console.error('error in generation init', error.message);
    if (error.code === TIMEOUT) {
      _timeout = error.message;
    } else throw error;
  });

  const sort = () => {
    if (!_isSorted) {
      _pop.sort((a, b) => {
        return rank(a.getFitness(), b.getFitness());
      });

      _isSorted = true;
    }
  };

  self.getId = () => {
    return `#${id}`;
  };

  self.getEpoch = () => {
    return epoch;
  };

  self.isReady = async () => {
    const promise = new Promise((resolve, reject) => {
      const start = new Date().getTime();
      let timer = setInterval(() => {
        const current = new Date().getTime();

        if (_timeout) {
          clearInterval(timer);
          timer = null;
          reject({
            code: TIMEOUT,
            message: `generation timed out after ${
              current - start
            }ms: ${_timeout}`,
          });
          return;
        }

        if (_active) {
          clearInterval(timer);
          timer = null;
          resolve(true);
        }
      }, 0);
    });

    return promise.catch((error) => {
      const index = self.getEpoch();
      console.error('error on generation ready', index);
      if (error.code === TIMEOUT) {
        throw {
          code: TIMEOUT,
          message: `generation ${index} timedout: ${error.message}`,
        };
      }
      throw { message: `generation ${index} not ready` };
    });
  };

  self.getPopulation = () => {
    return _pop;
  };

  self.setPopulation = (value) => {
    _pop = value;
  };

  self.getBest = () => {
    sort();

    const best = _pop[0];

    return { strategy: best.getStrategy(), fitness: best.getFitness() };
  };

  self.crossover = async () => {
    sort();

    let nextGen = [];

    for (let index = 0; index < total; index++) {
      const a = _pop[parents.a[index]];
      const b = _pop[parents.b[index]];

      const newIndi = await a.reproduce(b);

      newIndi.setIndex(index);
      newIndi.setEpoch(epoch + 1);

      await newIndi.isReady();

      nextGen[index] = newIndi;
    }

    return new Generation({ ...input, pop: nextGen, epoch: epoch + 1 });
  };

  self.run = async (active) => {
    const promises = _pop.map((item) => {
      return item.run();
    });

    const result = await Promise.all(promises);

    if (!_active || active === false) {
      return false;
    }

    return !result.some((item) => item === false);
  };

  self.stop = () => {
    _active = false;
    _pop.forEach((item) => {
      item.stop();
    });
  };
}

export default Generation;
