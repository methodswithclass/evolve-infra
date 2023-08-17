import { v4 as uuid } from 'uuid';

const TIMEOUT = 'TimeoutException';

function Individual(input) {
  const self = this;

  const {
    epoch = 1,
    gen = '',
    index = 0,
    strategy = {},
    getFitness: userGetFitness,
    mutate: userMutate,
    combine: userCombine,
  } = input || {};

  if (!userGetFitness || !userMutate || !userCombine) {
    throw { message: 'missing required function' };
  }

  let _gen = gen;
  let _strategy = strategy;
  let _epoch = epoch;
  let _index = index;
  let _fitness = 0;
  let _active = false;
  let _timeout = null;
  const id = uuid();

  const race = (userFn, input, timeout) => {
    return new Promise(async (resolve, reject) => {
      if (typeof userFn === 'function') {
        let shouldResolve = true;
        let shouldStop = false;
        const start = new Date().getTime();
        let timer = setInterval(() => {
          const current = new Date().getTime();

          if (shouldStop || current - start >= timeout) {
            clearInterval(timer);
            timer = null;
            shouldResolve = false;
            if (!shouldStop) {
              reject({
                code: TIMEOUT,
                message: `getGene timedout after ${current - start}ms`,
              });
            }
          }
        }, 0);

        const result = await userFn(input);
        if (!shouldResolve) {
          return;
        }
        shouldStop = true;
        resolve(result);
        return;
      }

      resolve(null);
    });
  };

  const getFitness = async (input) => {
    if (typeof userGetFitness === 'function') {
      return userGetFitness(input);
    }

    return 0;
  };

  const mutateTimeout = userMutate?.timeout || 200;

  const mutate = async (input) => {
    return race(userMutate, input, mutateTimeout);
  };

  const combine = async (a, b) => {
    return userCombine(a, b);
  };

  const init = async () => {
    if (Object.keys(_strategy).length === 0) {
      _strategy = await mutate();
    } else {
      _strategy = await mutate(_strategy);
    }

    _active = true;
  };

  init().catch((error) => {
    console.error('error in individual init', error.message);
    if (error.code === TIMEOUT) {
      _timeout = error.message;
    } else throw error;
  });

  const setFitness = (value) => {
    _fitness = value;
  };

  self.setGen = (value) => {
    _gen = value;
  };

  self.setEpoch = (value) => {
    _epoch = value;
  };

  self.setIndex = (value) => {
    _index = value;
  };

  self.getId = () => {
    return `${_gen}#${id}`;
  };

  self.getIndex = () => {
    return `${_epoch}#${_index}`;
  };

  self.isReady = async () => {
    const promise = new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        if (_timeout) {
          clearInterval(timer);
          timer = null;
          reject({
            code: TIMEOUT,
            message: `individual timed out: ${_timeout}`,
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
      const index = self.getIndex();
      console.error('error on individual ready', index);
      if (error.code === TIMEOUT) {
        throw error;
      }
      throw { message: `individual ${index} not ready` };
    });
  };

  self.getStrategy = () => {
    return _strategy;
  };

  self.getFitness = () => {
    return _fitness;
  };

  self.run = async () => {
    if (!_active) {
      return false;
    }
    try {
      const result = await getFitness({
        index: self.getIndex(),
        id: self.getId(),
        strategy: _strategy,
      });

      setFitness(result);
      return true;
    } catch (error) {
      const index = self.getIndex();
      console.error('error getting fitness', index, error.message);
      return false;
    }
  };

  self.reproduce = async (mate) => {
    const otherStrategy = mate.getStrategy();

    const newStategy = await combine(_strategy, otherStrategy);

    return new Individual({ ...input, strategy: newStategy });
  };

  self.stop = () => {
    _active = false;
  };
}

export default Individual;
