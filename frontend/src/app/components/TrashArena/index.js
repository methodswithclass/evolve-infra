import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import Plot from '../Plot';
import { average, checkMobile } from '../../utils/utils';

const showSimulation = false;

const Trash = (props) => {
  const { best, history, totalSteps, beginActions } = props;

  const isMobile = checkMobile();

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
    <Flex
      w="100%"
      h="100%"
      m="50px 0"
      flexDirection={`${isMobile ? 'column' : 'row'}`}
      justify="space-around"
      align="center"
    >
      <div
        className={`${
          isMobile ? 'trashplot-container-mobile' : 'trashplot-container'
        }`}
      >
        <div className="trashplot">
          <Plot points={history} />
        </div>
      </div>

      {showSimulation ? (
        <Flex
          h={`${isMobile ? '500px' : '300px'}`}
          flexDirection={`${isMobile ? 'column' : 'row'}`}
          align="center"
        >
          <div className={`${isMobile ? 'controls-mobile' : 'controls'}`}>
            {buttons.map((item) => (
              <Button key={item.id} w="60%" m={5} onClick={item.onClick}>
                {item.title}
              </Button>
            ))}
          </div>
          <div className={`grid`}></div>
          <div className={`${isMobile ? 'trashData-mobile' : 'trashData'}`}>
            steps:
            {beginActions > 0
              ? Math.floor(average(best?.strategy?.steps))
              : totalSteps}
          </div>
        </Flex>
      ) : null}
    </Flex>
  );
};

export default Trash;
