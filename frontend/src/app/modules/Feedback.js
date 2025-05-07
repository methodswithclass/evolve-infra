import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import Header from "../components/Header";
import FeedbackArena from "../components/FeedbackArena";
import Demo from "../components/Demo";
import { checkMobile } from "../utils/utils";

const FeedbackDemo = () => {
  const isMobile = checkMobile();
  return (
    <>
      <Header active="feedback" />
      <Flex w="100%" h="100%" flexDirection="column" align="center">
        {isMobile ? <Text fontSize={30}>Feedback</Text> : null}
        <Demo name="feedback" arena={FeedbackArena} />
      </Flex>
    </>
  );
};

export default FeedbackDemo;
