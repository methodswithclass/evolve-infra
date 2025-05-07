import { Flex, Text } from "@chakra-ui/react";

const Robot = (props) => {
  const { size } = props;
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      justify="center"
      align="center"
    >
      <Text fontSize={`${size}px`}>x</Text>
    </Flex>
  );
};

export default Robot;
