import React, { useState } from 'react';

const Point = (props) => {
  const { index, value, x, y } = props;

  const [isShown, setShown] = useState(false);

  return (
    <div
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
      className="point"
      style={{ left: `${index}%`, bottom: `${value}%` }}
    >
      {isShown && (
        <div className="pointPopover">
          <div>x: {x}</div>
          <div>y: {y}</div>
        </div>
      )}
    </div>
  );
};

export default Point;
