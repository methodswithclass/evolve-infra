import { getActionById } from "../../../utils/utils";

function Robot(params) {
  const self = this;

  const { env, start, total, index } = params;

  let _pos = null;
  let _plan = null;

  const setPos = (value = {}) => {
    _pos = { x: value.x, y: value.y };
  };

  const init = () => {
    setPos(start === "random" ? env.getRandom() : { x: 0, y: 0 });
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
      return "fail";
    }

    setPos(newPos);

    return "success";
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
    let result = "success";
    // console.log('debug action', action, id, JSON.stringify(_plan), state);
    if (action.name === "clean") {
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
