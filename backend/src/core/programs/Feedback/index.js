import { sum } from '../../../utils/utils';

const runProgram = async ({ dna }) => {
  const check = (value) => {
    const diff = Math.abs(value - 50);
    const percent = diff / 100;
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

const getGene = () => Math.floor(Math.random() * 100);

export default { getGene, run: runProgram };
