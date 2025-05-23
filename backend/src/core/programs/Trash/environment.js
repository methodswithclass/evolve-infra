import { outcomes } from "./robot";

const Block = function (x, y) {
  const self = this;

  let _dirty = false;
  let _pos = { x: x, y: y };

  self.setDirty = () => {
    _dirty = true;
  };

  self.setClean = () => {
    _dirty = false;
  };

  self.isDirty = () => {
    return _dirty;
  };

  self.getPos = () => {
    return _pos;
  };
};

function Environment(params) {
  const self = this;

  const { size, condition } = params;

  let _arena = [];
  let _trash = [];

  self.getRandom = () => {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    return { x: x, y: y };
  };

  const getRandomPoint = (array) => {
    const pos = self.getRandom();

    let _repeat = false;

    for (let m of array) {
      if (m.x === pos.x && m.y === pos.y) {
        _repeat = true;
        break;
      }
    }

    if (_repeat) {
      return getRandomPoint(array);
    }

    array.push(pos);

    return array;
  };

  const make = () => {
    let _row = [];
    let _array = [];

    for (let j = 0; j < size; j++) {
      _row = [];
      for (let i = 0; i < size; i++) {
        _row[i] = new Block(i, j);
      }
      _array[j] = _row;
    }

    return _array;
  };

  const makeTrash = () => {
    const total = Math.floor(size * size * condition);

    let _array = [];

    for (let i = 0; i < total; i++) {
      _array = getRandomPoint(_array);
    }

    return _array;
  };

  const placeTrash = () => {
    for (let trashLoc of _trash) {
      _arena[trashLoc.y][trashLoc.x].setDirty();
    }
  };

  const init = () => {
    _arena = make();
    _trash = makeTrash();
    placeTrash();
  };

  init();

  const check = (pos) => {
    if (pos.x < 0 || pos.x > size - 1 || pos.y < 0 || pos.y > size - 1) {
      return 2;
    }

    if (_arena[pos.y][pos.x].isDirty()) {
      return 1;
    }

    return 0;
  };

  const getState = (value) => {
    const block = _arena[value.y][value.x];
    return block.isDirty();
  };

  self.getSize = () => {
    return size;
  };

  self.clean = (value) => {
    const block = _arena[value.y][value.x];
    if (!block.isDirty()) {
      return "fail";
    }
    block.setClean();
    if (block.isDirty()) {
      return "fail";
    }
    return "success";
  };

  self.exportArena = () => {
    let _array = [];
    let _row = [];

    for (let j = 0; j < size; j++) {
      _row = [];
      for (let i = 0; i < size; i++) {
        _row[i] = { x: i, y: j, trash: getState({ x: i, y: j }) };
      }
      _array[i] = _row;
    }

    return _array;
  };

  self.assess = (pos) => {
    const base = 3;

    const options = [
      check({ x: pos.x, y: pos.y - 1 }),
      check({ x: pos.x, y: pos.y + 1 }),
      check({ x: pos.x - 1, y: pos.y }),
      check({ x: pos.x + 1, y: pos.y }),
      check(pos),
    ];

    const index = options.reduce((accum, item, index) => {
      return accum + item * Math.pow(base, index);
    }, 0);

    return index;
  };

  self.reset = () => {
    init();
  };
}

export default Environment;
