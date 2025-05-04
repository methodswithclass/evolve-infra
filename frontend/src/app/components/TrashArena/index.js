import React, { useEffect, useState, useCallback } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import Plot from "../Plot";
import Grid from "../Grid";
import { send, subscribe } from "../../services/api-service";
import { v4 as uuid } from "uuid";

const intervalTime = 500;

const Trash = (props) => {
  const { best = { fitness: 0 }, history, totalSteps } = props;

  console.log("debug best", best);

  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState([]);
  const [robot, setRobot] = useState({ x: 0, y: 0 });
  const [totalFit, setTotalFit] = useState(0);
  const [stepNumber, setStepNumber] = useState(1);
  const [move, setMove] = useState("");
  const [success, setSuccess] = useState("");
  const [gridKey, setGridKey] = useState("1");

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
    setTotalFit(0);
    setStepNumber(1);
    setMove("");
    setSuccess("");
    setGridKey(uuid());
  };

  const handleStep = useCallback(
    (data) => {
      console.log("debug data", data);
      const { stepNum, action, result, grid, robot, points, message } = data;
      if (message) {
        console.log("debug error in evolve", message);
        return;
      }

      setGrid(grid);
      setRobot(robot);
      setTotalFit((prevState) => prevState + points);
      setStepNumber(stepNum);
      setMove(action.title);
      setSuccess(result);

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
        <div>Point History</div>
        <div className="trashplot">
          <Plot points={history} />
        </div>
      </div>
      <Flex direction="row" margin="100px 0" justify="start" align="start">
        <Flex
          direction="column"
          width="100px"
          margin="200px 20px"
          justify="space-around"
          align="center"
        >
          {buttons.map((item) => (
            <Button
              key={item.id}
              width="100%"
              margin="20px 10px"
              onClick={item.onClick}
              disabled={!item.enabled}
            >
              {item.title}
            </Button>
          ))}
        </Flex>

        <Flex direction="column">
          <Flex
            direction="column"
            margin="20px"
            padding="20px"
            justify="center"
            align="start"
            width="300px"
            border="1px solid black"
          >
            <Flex direction="row" width="100%" justify="center" align="center">
              <Text width="50%">Step number:</Text>
              <Text width="50%">{stepNumber}</Text>
            </Flex>
            <Flex direction="row" width="100%" justify="center" align="center">
              <Text width="50%">Action:</Text>
              <Text width="50%">{move}</Text>
            </Flex>
            <Flex direction="row" width="100%" justify="center" align="center">
              <Text width="50%">Result:</Text>
              <Text width="50%">{success}</Text>
            </Flex>
            <Flex direction="row" width="100%" justify="center" align="center">
              <Text width="50%">Score:</Text>
              <Text width="50%">{totalFit}</Text>
            </Flex>
          </Flex>

          <Grid key={gridKey} grid={grid} robot={robot} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Trash;
