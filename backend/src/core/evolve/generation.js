import Individual from './individual';
import { v4 as uuid } from 'uuid';

function Generation(params) {
  const self = this;

  const { pop, epoch, deps } = params;
  const { program, dbService } = deps;

  const total = program.totalPop;
  const topPercent = 10;
  const parents = { a: [], b: [] };
  let _pop = pop || [];
  let _isSorted = false;
  let _active = false;
  const id = uuid();

  const getRandomIndex = () => {
    return Math.floor(Math.random() * topPercent);
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

  const init = () => {
    console.log('debug pop', _pop, total);
    if (_pop.length === 0) {
      for (let index = 0; index < total; index++) {
        console.log('debug create indi', index);
        _pop[index] = new Individual({ gen: id, deps });
      }
    } else {
      _pop.forEach((item) => {
        item.setGen(id);
      });
    }

    getRandomParents();

    _active = true;
  };

  init();

  const sort = () => {
    if (!_isSorted) {
      _pop.sort((a, b) => {
        return b.getFitness() - a.getFitness();
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

  self.getPopulation = () => {
    return _pop;
  };

  self.setPopulation = (value) => {
    _pop = value;
  };

  self.getBest = () => {
    sort();

    const best = _pop[0];

    console.log('debug best', best.getId());

    return { dna: best.getDna(), fitness: best.getFitness() };
  };

  self.crossover = () => {
    sort();

    let nextGen = [];

    for (let index = 0; index < total; index++) {
      const a = _pop[parents.a[index]];
      const b = _pop[parents.b[index]];

      const newIndi = a.reproduce(b);

      nextGen[index] = newIndi;
    }

    return new Generation({ pop: nextGen, epoch: epoch + 1, deps });
  };

  self.run = async () => {
    const { active } = await dbService.get();

    if (!active) {
      return false;
    }

    const promises = _pop.map((item) => {
      return item.run();
    });

    await Promise.all(promises);
    return true;
  };

  self.hardStop = () => {
    _active = false;
    _pop.forEach((item) => {
      item.hardStop();
    });
  };
}

export default Generation;
