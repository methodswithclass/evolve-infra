import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Header from '../components/Header';
import TrashExArena from '../components/TrashExArena';
import Demo from '../components/Demo';
import { checkMobile } from '../utils/utils';

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
  const isMobile = checkMobile();
  return (
    <>
      <Flex w="100%" h="100%" flexDirection="column" align="center">
        <Header active="trash-ex" />
        {isMobile ? <Text fontSize={30}>Trash Pickup Experimental</Text> : null}
        <Demo name="trash-ex" total={power()} arena={TrashExArena} />
      </Flex>
    </>
  );
};

export default TrashDemo;
