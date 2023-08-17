import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Header from '../components/Header';
import FeedbackArena from '../components/FeedbackArena';
import Demo from '../components/Demo';
import { checkMobile } from '../utils/utils';

const FeedbackDemo = () => {
  const isMobile = checkMobile();
  return (
    <>
      <Flex w="100%" h="100%" flexDirection="column" align="center">
        <Header active="feedback" />
        {isMobile ? <Text fontSize={30}>Feedback</Text> : null}
        <Demo name="feedback" arena={FeedbackArena} />
      </Flex>
    </>
  );
};

export default FeedbackDemo;
