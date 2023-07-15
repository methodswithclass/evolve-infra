import { v4 as uuid } from 'uuid';

function Individual(params) {
  const self = this;

  const { gen, dna, epoch, index, deps } = params || {};
  const { program, dbService } = deps;
  const { run, getGene, ...options } = program;

  const total = program?.totalLength;
  let _gen = gen;
  let _dna = dna || [];
  let _index = index;
  let _fitness = 0;
  let _active = false;
  const id = uuid();

  const mutate = (input) => {
    const output = input.map((item) => {
      if (Math.random() <= 0.02) {
        return getGene();
      }
      return item;
    });

    return output;
  };

  const init = () => {
    if (_dna.length === 0) {
      for (let index = 0; index < total; index++) {
        _dna[index] = getGene();
      }
    } else {
      _dna = mutate(_dna);
    }

    _active = true;
  };

  init();

  const setFitness = (value) => {
    _fitness = parseInt(value, 10);
  };

  const everyOther = (otherDna) => (gene, index) => {
    return index % 2 === 0 ? otherDna[index] : gene;
  };

  const split = (otherDna) => (gene, index) => {
    return index < otherDna.length / 2 ? gene : otherDna[index];
  };

  self.setGen = (value) => {
    _gen = value;
  };

  self.setIndex = (value) => {
    _index = value;
  };

  self.getId = () => {
    return `#${_gen}#${id}`;
  };

  self.getIndex = () => {
    return `#${epoch}#${_index}`;
  };

  self.getDna = () => {
    return _dna;
  };

  self.getFitness = () => {
    return _fitness;
  };

  self.run = async () => {
    const result = await run({
      ...options,
      index: self.getIndex(),
      id: self.getId(),
      dna: _dna,
    });

    console.log('debug fitness', result);

    setFitness(result);

    return true;
  };

  self.reproduce = (mate) => {
    const otherDna = mate.getDna();

    const newDna = _dna.map(
      program?.type === 'split' ? split(otherDna) : everyOther(otherDna)
    );

    return new Individual({ dna: newDna, deps });
  };

  self.hardStop = () => {
    _active = false;
  };
}

export default Individual;
