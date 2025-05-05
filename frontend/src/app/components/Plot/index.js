import { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import Point from "./Point";
import { min, max } from "../../utils/utils";

const round = (number, size) => {
  return Math.round(number / size) * size;
};

const Plot = (props) => {
  const { points, maxY, minY } = props;

  const [scaleY, setYScale] = useState([]);
  const [scaleX, setXScale] = useState([]);

  const minYPoints = min(points);

  const minPoint =
    minY >= 0 && !Number.isNaN(minY)
      ? minY
      : minYPoints + (minYPoints / Math.abs(minYPoints)) * 4;
  const maxPoint = maxY >= 0 && !Number.isNaN(maxY) ? maxY : max(points) + 4;

  const yBreak = scaleY.length > 200 ? 50 : scaleY.length > 50 ? 20 : 10;
  const xBreak = scaleX.length > 1000 ? 500 : scaleX.length > 500 ? 100 : 20;

  useEffect(() => {
    if (points.length === 0) {
      return;
    }

    const ynum = [];
    const xnum = [];

    const lower = round(minPoint, 10);

    for (let i = lower; i < maxPoint; i += 1) {
      ynum.push(i);
    }

    for (let j = 0; j < points.length; j += 1) {
      xnum.push(j);
    }

    setYScale(ynum);
    setXScale(xnum);
  }, [minPoint, maxPoint, points]);

  return (
    <Flex w="60%" direction="row">
      <Flex
        direction="column-reverse"
        m="20px"
        h="300px"
        justify="space-around"
        align="end"
      >
        {scaleY.map((item, index) => (
          <div
            key={`item${index}`}
            style={{
              position: "relative",
              width: "100px",
              textAlign: "end",
              height: `${100 / scaleY.length}%`,
            }}
          >
            {index % yBreak === 0 ? item : null}
          </div>
        ))}
      </Flex>
      <Flex w="100%" direction="column">
        <div className="trashplot-container">
          <div>Point History</div>
          <div className="trashplot">
            <div className="points">
              {points?.map((item, index) => (
                <Point
                  key={`${item}#${index}`}
                  x={index}
                  y={item}
                  index={(index / points.length) * 100 * 0.9 + (100 - 90) / 2}
                  value={
                    ((item - minPoint) /
                      (maxPoint !== minPoint ? maxPoint - minPoint : 1)) *
                    100
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <Flex direction="row" m="20px" justify="center" align="space-around">
          {scaleX.map((item, index) => (
            <div
              key={`item${index}`}
              style={{
                position: "relative",
                height: "50px",
                textAlign: "end",
                width: `${index % 20 === 0 ? "20px" : 100 / scaleX.length}%`,
              }}
            >
              {index % xBreak === 0 ? item : null}
            </div>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Plot;
