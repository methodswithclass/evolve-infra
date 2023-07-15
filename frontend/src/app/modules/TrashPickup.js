import React from 'react';
import Trash from '../components/Trash';
import Demo from '../components/Demo';

const power = () => {
  const base = 3;
  const state = 2;
  const total = 5;
  let index = 1;

  for (let i = 0; i < total; i++) {
    index += state * Math.pow(base, i);
  }

  return index;
};

const TrashDemo = () => {
  return <Demo name="trash" total={power()} arena={Trash} />;
};

export default TrashDemo;
