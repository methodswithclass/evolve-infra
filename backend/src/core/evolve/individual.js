import { v4 as uuid } from 'uuid';

function Individual(params) {
  const self = this;

  const { gen, dna, deps } = params || {};
  const { program, dbService } = deps;

  const total = program?.totalLength;
  let _gen = gen;
  let _dna = dna || [];
  let _fitness = 0;
  let _index = null;
  let _active = false;
  const id = uuid();

  const mutate = (input) => {
    const output = input.map((item) => {
      if (Math.random() <= 0.01) {
        return program?.getGene();
      }
      return item;
    });

    return output;
  };

  const init = () => {
    if (_dna.length === 0) {
      for (let index = 0; index < total; index++) {
        _dna[index] = program?.getGene();
      }
    } else {
      _dna = mutate(_dna);
    }

    _active = true;
  };

  init();

  const everyOther = (otherDna) => (gene, index) => {
    return index % 2 === 0 ? otherDna[index] : gene;
  };

  const split = (otherDna) => (gene, index) => {
    return index < otherDna.length / 2 ? gene : otherDna[index];
  };

  self.setGen = (value) => {
    _gen = value;
  };

  self.getId = () => {
    return `#${_gen}#${id}`;
  };

  self.getIndex = () => {
    return _index;
  };

  self.setIndex = (value) => {
    _index = value;
  };

  self.getDna = () => {
    return _dna;
  };

  self.instruct = (value) => {
    _dna = value;
  };

  self.getFitness = () => {
    return _fitness;
  };

  self.setFitness = (value) => {
    _fitness = parseInt(value, 10);
  };

  self.run = async () => {
    // const { active } = await dbService.get();

    // if (!active) {
    //   return false;
    // }

    const result = await program.run(_dna);

    self.setFitness(result);

    return true;
  };

  self.reproduce = (mate) => {
    const otherDna = mate.getDna();

    const newDna = _dna.map(
      program?.type === 'split' ? split(otherDna) : everyOther(otherDna)
    );

    const mutated = mutate(newDna);

    return new Individual({ dna: mutated, deps });
  };

  self.hardStop = () => {
    _active = false;
  };
}

export default Individual;
