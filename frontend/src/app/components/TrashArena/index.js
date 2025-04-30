import React, { useEffect, useState, useCallback } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import Plot from "../Plot";
import Grid from "../Grid";
import { send, subscribe } from "../../services/api-service";

const intervalTime = 500;

const Trash = (props) => {
  const { best = [], history, totalSteps } = props;

  console.log("debug best", best);

  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState([]);
  const [robot, setRobot] = useState({ x: 0, y: 0 });
  const [totalFit, setTotalFit] = useState(0);

  const createGrid = () => {
    const data = {
      params: { width: 5, height: 5, trashRate: 0.5 },
    };

    send("create", data);
  };

  const step = (input) => {
    const data = {
      params: {
        ...input,
      },
    };
    send("step", data);
  };

  const handleConnected = (data) => {
    const { connected } = data;

    if (connected) {
      createGrid();
    }
  };

  const handleCreate = (data) => {
    console.log("debug create", data);
    const { grid, robot } = data;

    setGrid(grid);
    setRobot(robot);
  };

  const handleStep = useCallback(
    (data) => {
      console.log("debug data", data);
      const { stepNum, grid, robot, fit, message } = data;
      if (message) {
        console.log("debug error in evolve", message);
        return;
      }

      setGrid(grid);
      setRobot(robot);
      setTotalFit(totalFit + fit);

      if (running && stepNum < 50) {
        setTimeout(() => {
          step({ grid, robot, dna: best?.strategy?.dna, stepNum: stepNum + 1 });
        }, intervalTime);
      }
    },
    [running]
  );

  useEffect(() => {
    const unsubConnected = subscribe("connected", handleConnected);
    const unsubCreate = subscribe("create", handleCreate);
    const unsubStep = subscribe("step", handleStep);
    return () => {
      unsubConnected();
      unsubCreate();
      unsubStep();
    };
  }, [handleStep]);

  const buttons = [
    {
      id: "reset",
      title: "Reset",
      enabled: true,
      onClick: () => {
        createGrid();
      },
    },
    {
      id: "play",
      title: "Play",
      enabled: best?.strategy?.dna?.length > 0,
      onClick: () => {
        setRunning(true);
        step({ stepNum: 1, grid, robot, dna: best?.strategy?.dna });
      },
    },
    {
      id: "stop",
      title: "Stop",
      enabled: running,
      onClick: () => {
        setRunning(false);
      },
    },
  ];

  return (
    <Flex width="100%" direction="column" justify="start" align="center">
      <div className="trashplot-container">
        <div className="trashData">steps: {totalSteps}</div>
        <div className="trashplot">
          <Plot points={history} />
        </div>
      </div>

      <Flex margin="100px 0" direction="column">
        <Flex direction="row" justify="space-around" align="center">
          {buttons.map((item) => (
            <Button
              key={item.id}
              width="25%"
              margin="20px 10px"
              onClick={item.onClick}
              disabled={!item.enabled}
            >
              {item.title}
            </Button>
          ))}
        </Flex>
        <Flex direction="row" justify="center" align="center">
          <Text>Score:</Text>
          <Text>{totalFit}</Text>
        </Flex>
        <Grid grid={grid} robot={robot} />
      </Flex>
    </Flex>
  );
};

export default Trash;
