import React from 'react';

const Point = (props) => {
  const { index, value } = props;

  return (
    <div
      className="point"
      style={{ left: `${index}%`, bottom: `${value}%` }}
    ></div>
  );
};

export default Point;
