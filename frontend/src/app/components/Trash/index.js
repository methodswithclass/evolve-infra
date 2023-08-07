import React from 'react';
import { Button } from '@chakra-ui/react';
import Plot from '../Plot';
import { average } from '../../utils/utils';

const Trash = (props) => {
  const { best, history, beginActions } = props;

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
    <div className="trashDemo">
      <div className="trashplot">
        <Plot points={history} />
      </div>

      <div className="trashArena">
        <div className="controls">
          {buttons.map((item) => (
            <Button key={item.id} w="60%" m={5} onClick={item.onClick}>
              {item.title}
            </Button>
          ))}
        </div>
        <div className="grid"></div>
      </div>
      <div className="trashData">
        steps: {average(best?.dna?.slice(0, beginActions))}
      </div>
    </div>
  );
};

export default Trash;
