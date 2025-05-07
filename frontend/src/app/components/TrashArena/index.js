import React, { useEffect, useState, useCallback } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import Plot from "../Plot";
import Grid from "../Grid";
import { send, subscribe, isConnected } from "../../services/api-service";
import Select from "../Select";
import { v4 as uuid } from "uuid";
import { blue1 } from "../../utils/constants";

const intervalTime = 500;

const Trash = (props) => {
  const { best = { fitness: 0 }, history, ...rest } = props;

  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState([]);
  const [robot, setRobot] = useState({ x: 0, y: 0 });
  const [totalFit, setTotalFit] = useState(0);
  const [stepNumber, setStepNumber] = useState(1);
  const [move, setMove] = useState("move down");
  const [success, setSuccess] = useState("success");
  const [gridKey, setGridKey] = useState("1");
  const [size, setSize] = useState(null);
  const [connected, setConnected] = useState(false);

  const totalSteps = size * size * 2;

  console.log("debug connected", connected);

  if (!connected && isConnected()) {
    setConnected(true);
  }

  const createGrid = (gridSize) => {
    if (!gridSize) {
      return;
    }

    const data = {
      params: { size: gridSize, trashRate: 0.5 },
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
      setConnected(true);
    }
  };

  const handleCreate = (data) => {
    console.log("debug create", data);
    const { grid, robot } = data;

    setGrid(grid);
    setRobot(robot);
    setTotalFit(0);
    setStepNumber(1);
    setMove("move down");
    setSuccess("success");
    setGridKey(uuid());
  };

  const onChange = (e) => {
    setSize(e?.value?.[0]);
  };

  const handleStep = useCallback(
    (data) => {
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

      if (running && stepNum < totalSteps) {
        setTimeout(() => {
          step({ grid, robot, dna: best?.strategy?.dna, stepNum: stepNum + 1 });
        }, intervalTime);
      } else {
        setRunning(false);
      }
    },
    [running, best]
  );

  useEffect(() => {
    if (connected) {
      setSize(5);
    }
  }, [connected]);

  useEffect(() => {
    setRunning(false);
    createGrid(size);
  }, [size]);

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
      enabled: !running,
      onClick: () => {
        setRunning(false);
        createGrid(size);
      },
    },
    {
      id: "play",
      title: "Play",
      enabled: best?.strategy?.dna?.length > 0 && !running,
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
    <Flex direction="column" justify="start" align="center" {...rest}>
      <Plot name="trash" points={history} />
      <Flex direction="column" w="60%" minWidth="500px" m="100px 0">
        <Text
          color={blue1}
          w="100%"
          borderTop={`5px solid ${blue1}`}
          fontSize="30px"
          m="0 0 100px 0"
        >
          Simulation
        </Text>
        <Flex direction="row" justify="space-around" align="start">
          <Flex
            direction="row"
            margin="20px"
            padding="20px"
            justify="center"
            align="start"
            width="300px"
            border="1px solid black"
          >
            <Flex
              direction="column"
              m="0 20px"
              justify="start"
              align="end"
              w="50%"
            >
              <Text>Total Steps:</Text>
              <Text>Step number:</Text>
              <Text>Action:</Text>
              <Text>Result:</Text>
              <Text>Score:</Text>
            </Flex>
            <Flex direction="column" justify="start" align="start" w="50%">
              <Text>{totalSteps}</Text>
              <Text>{stepNumber}</Text>
              <Text>{move}</Text>
              <Text>{success}</Text>
              <Text>{totalFit}</Text>
            </Flex>
          </Flex>

          <Flex
            direction="column"
            m="20px 0"
            justify="start"
            align="center"
            w="200px"
            h="200px"
          >
            {!running && (
              <>
                <Text>Grid size</Text>
                <Select
                  w="100%"
                  items={[
                    { label: "5", value: 5 },
                    { label: "10", value: 10 },
                    { label: "20", value: 20 },
                  ]}
                  value={size}
                  onChange={onChange}
                />
              </>
            )}
          </Flex>
        </Flex>
        <Flex
          direction="column"
          margin="50px 0"
          justify="center"
          align="center"
        >
          <Flex
            direction="row"
            width="100px"
            margin="20px"
            justify="center"
            align="space-around"
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

          <Grid key={gridKey} grid={grid} robot={robot} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Trash;
