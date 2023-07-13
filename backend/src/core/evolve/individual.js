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

  const init = () => {
    if (_dna.length === 0) {
      for (let index = 0; index < total; index++) {
        _dna[index] = program?.getGene();
      }
    }

    _active = true;
  };

  init();

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
    const { active } = await dbService.get();

    if (!active) {
      return false;
    }

    self.setFitness(program?.getGene());

    return true;
  };

  self.reproduce = (mate) => {
    const otherDna = mate.getDna();

    const newDna = _dna.map((gene, index) => {
      return index % 2 === 0 ? otherDna[index] : gene;
    });

    return new Individual({ dna: newDna, deps });
  };

  self.hardStop = () => {
    _active = false;
  };
}

export default Individual;
