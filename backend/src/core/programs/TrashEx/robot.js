const posMap = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  here: { x: 0, y: 0 },
};

const getRandomMove = () => {
  var test = Math.random();

  if (test < 0.25) {
    return posMap['up'];
  } else if (test < 0.5) {
    return posMap['down'];
  } else if (test < 0.75) {
    return posMap['left'];
  } else {
    return posMap['right'];
  }
};

export const actions = [
  {
    id: 0,
    name: 'up',
    change: () => {
      return posMap['up'];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 1,
    name: 'down',
    change: () => {
      return posMap['down'];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 2,
    name: 'left',
    change: () => {
      return posMap['left'];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 3,
    name: 'right',
    change: () => {
      return posMap['right'];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 4,
    name: 'random',
    change: getRandomMove,
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 5,
    name: 'stay',
    change: () => {
      return posMap['here'];
    },
    points: {
      success: 0,
      fail: -5,
    },
  },
  {
    id: 6,
    name: 'clean',
    change: () => {
      return posMap['here'];
    },
    points: {
      success: 10,
      fail: -5,
    },
  },
];

const getActionById = (id) => {
  const action = actions.find((item) => item.id === id);

  return action;
};

function Robot(params) {
  const self = this;

  const { env, start, total, index } = params;

  let _pos = null;
  let _plan = null;

  const setPos = (value = {}) => {
    _pos = { x: value.x, y: value.y };
  };

  const init = () => {
    setPos(start === 'random' ? env.getRandom() : { x: 0, y: 0 });
  };

  init();

  const move = (diff) => {
    const size = env.getSize();

    const newPos = { x: _pos.x + diff.x, y: _pos.y + diff.y };

    if (
      newPos.x < 0 ||
      newPos.x > size - 1 ||
      newPos.y < 0 ||
      newPos.y > size - 1
    ) {
      return 'fail';
    }

    setPos(newPos);

    return 'success';
  };

  self.getIndex = () => {
    return index;
  };

  self.reset = () => {
    init();
    env.reset();
  };

  self.update = () => {
    const pre = { x: _pos.x, y: _pos.y };
    const state = env.assess(pre);
    const id = _plan[state];
    const action = getActionById(id);
    let result = 'success';
    // console.log('debug action', action, id, JSON.stringify(_plan), state);
    if (action.name === 'clean') {
      result = env.clean(pre);
    } else {
      result = move(action.change());
    }

    return { action, result, pre, post: _pos };
  };

  self.getPos = () => {
    return _pos;
  };

  self.instruct = (value) => {
    _plan = value;
  };

  self.getTotal = () => {
    return total;
  };
}

export default Robot;
