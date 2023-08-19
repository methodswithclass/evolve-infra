import { sum } from '../../../utils/utils';

const getFeedbackProgram = (options) => {
  const { newValue, maxValue, geneTotal } = options;

  const getFitness = async ({ strategy: dna }) => {
    if (!dna) {
      return 0;
    }

    const check = (value) => {
      const diff = Math.abs(value - newValue);
      const percent = diff / maxValue;
      if (percent < 0.01) {
        return 50;
      } else if (percent > 0.01) {
        return -20;
      }

      return 0;
    };

    const score = dna.map((item) => {
      return check(item);
    });

    return sum(score);
  };

  const getGene = () => {
    return Math.floor(Math.random() * maxValue);
  };

  const mutate = (strategy) => {
    const newStrategy = [];

    if (!strategy) {
      for (let i = 0; i < geneTotal; i++) {
        newStrategy.push(getGene());
      }

      return newStrategy;
    }

    return strategy.map((item) => {
      if (Math.random() < 0.02) {
        return getGene();
      }

      return item;
    });
  };

  const combine = (a, b) => {
    const dna = a;
    const otherDna = b;

    const newDna = dna.map((item, index) => {
      return index % 2 === 0 ? item : otherDna[index];
    });

    return newDna;
  };

  return { mutate, getFitness, combine };
};

export default getFeedbackProgram;
