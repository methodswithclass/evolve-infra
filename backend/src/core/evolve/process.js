import Evolve from "@methodswithclass/evolve";
import getFeedback from "../programs/Feedback";
import getTrashEx from "../programs/TrashEx";
import getTrash from "../programs/Trash";

export const run = async ({ dbService, sendService, params }) => {
  const { demo } = params;

  const program =
    demo === "trash"
      ? getTrash(params)
      : demo === "trash-ex"
      ? getTrashEx(params)
      : getFeedback(params);

  const evolve = Evolve({
    ...params,
    beforeEach: async () => {
      const { active } = await dbService.get();

      return active;
    },
    afterEach: async (input) => {
      await sendService.send(input);
    },
    onEnd: async (input) => {
      await sendService.send({ ...input, final: true });
    },
    ...program,
  });
  await dbService.update({ payload: { active: true } });
  await evolve.start();
};

export const create = async ({ sendService, params }) => {
  const program = getTrash(params);

  const output = program.create(params);

  await sendService.send(output);
};

export const step = async ({ sendService, params }) => {
  const program = getTrash(params);

  const output = program.simulate(params);

  await sendService.send(output);
};
