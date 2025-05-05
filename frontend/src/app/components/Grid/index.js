import { Flex } from "@chakra-ui/react";
import Block from "./Block";

const totalWidth = 500;
const totalHeight = 500;
const margin = 5;

const Grid = (props) => {
  const { grid = [], robot = {} } = props;
  const height = `${totalHeight / (grid.length || 1) - margin}`;
  return (
    <Flex
      direction="column"
      width="500px"
      height="500px"
      justify="space-around"
      align="space-around"
      border="solid black 1px"
    >
      {grid.map((row, j) => {
        const width = `${totalWidth / (row.length || 1) - margin}`;
        return (
          <Flex
            key={`row${j}`}
            direction="row"
            justify="space-around"
            align="space-around"
          >
            {row.map((block, i) => (
              <Block
                key={`block${i}${j}`}
                block={block}
                robot={robot}
                pos={{ x: i, y: j }}
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
