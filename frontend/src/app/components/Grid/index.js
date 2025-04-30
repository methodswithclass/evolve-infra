import { Flex } from "@chakra-ui/react";
import Block from "./Block";

const totalWidth = 500;
const totalHeight = 500;
const margin = 5;

const Grid = (props) => {
  const { grid = [], robot = {} } = props;
  const height = `${totalWidth / (grid.length || 1) - margin}px`;
  return (
    <Flex
      direction="column"
      width="500px"
      height="500px"
      justify="space-around"
      align="space-around"
      border="solid black 1px"
    >
      {grid.map((row, i) => {
        const width = `${totalHeight / (row.length || 1) - margin}px`;
        return (
          <Flex
            key={`row${i}`}
            direction="row"
            justify="space-around"
            align="space-around"
          >
            {row.map((block, j) => (
              <Block
                key={`block${i}${j}`}
                block={block}
                robot={robot}
                pos={{ x: j, y: i }}
                size={{ width, height }}
              />
            ))}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default Grid;
