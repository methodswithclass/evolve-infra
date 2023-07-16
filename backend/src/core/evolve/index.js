import Generation from './generation';

function Epoch(params) {
  const self = this;

  const { options, sendService } = params || {};
  const { first, best, totalGen } = options;

  let _current = null;
  let _epoch = null;

  const init = () => {
    _current = new Generation({ epoch: first, best, deps: params });
  };

  init();

  const run = async (_gen) => {
    _epoch = _gen.getEpoch();
    _current = _gen;
    console.log('debug epoch', _epoch);
    const result = await _current.run();

    if (!result || _epoch >= totalGen) {
      console.log('debug finished', _epoch);
      return;
    }

    await sendService.send({
      epoch: _epoch,
      best: _current.getBest(),
    });

    const next = _current.crossover();

    await run(next);
  };

  self.start = async () => {
    await run(_current);
  };

  self.hardStop = () => {
    _current.hardStop();
  };
}

export default Epoch;
