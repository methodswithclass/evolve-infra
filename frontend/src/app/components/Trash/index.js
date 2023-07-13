import React from 'react';
import { Button } from '@chakra-ui/react';

const Trash = (props) => {
  const { best } = props;

  const buttons = [
    {
      id: 'reset',
      title: 'Reset',
      onClick: () => {},
    },
    {
      id: 'play',
      title: 'Play',
      onClick: () => {},
    },
    {
      id: 'stop',
      title: 'Stop',
      onClick: () => {},
    },
  ];

  return (
    <div className="trashArena">
      <div className="controls">
        {buttons.map((item) => (
          <Button w="60%" m={5} onClick={item.onClick}>
            {item.title}
          </Button>
        ))}
      </div>
      <div className="grid"></div>
    </div>
  );
};

export default Trash;
