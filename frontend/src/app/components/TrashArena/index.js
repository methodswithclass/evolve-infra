import React, { useEffect, useState, useCallback } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import Plot from "../Plot";
import Grid from "../Grid";
import { send, subscribe } from "../../services/api-service";
import Select from "../Select";
import { v4 as uuid } from "uuid";

const intervalTime = 500;

const Trash = (props) => {
  const { best = { fitness: 0 }, history, totalSteps } = props;

  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState([]);
  const [robot, setRobot] = useState({ x: 0, y: 0 });
  const [totalFit, setTotalFit] = useState(0);
  const [stepNumber, setStepNumber] = useState(1);
  const [move, setMove] = useState("move down");
  const [success, setSuccess] = useState("success");
  const [gridKey, setGridKey] = useState("1");
  const [size, setSize] = useState(5);

  const createGrid = () => {
    const data = {
      params: { size, trashRate: 0.5 },
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
      setSize(5);
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
      }
    },
    [running]
  );

  useEffect(() => {
    setRunning(false);
    createGrid();
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
      enabled: true,
      onClick: () => {
        setRunning(false);
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
      <Plot points={history} />
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
          <Flex direction="row" w="500px" justify="center" align="space-around">
            <Flex
              direction="column"
              margin="20px 20px 50px 20px"
              padding="20px"
              justify="center"
              align="start"
              width="80%"
              border="1px solid black"
            >
              <Flex
                direction="row"
                width="100%"
                justify="center"
                align="center"
              >
                <Flex
                  direction="column"
                  m="0 20px"
                  justify="start"
                  align="end"
                  w="50%"
                >
                  <Text>Step number:</Text>
                  <Text>Action:</Text>
                  <Text>Result:</Text>
                  <Text>Score:</Text>
                </Flex>
                <Flex direction="column" justify="start" align="start" w="50%">
                  <Text>{stepNumber}</Text>
                  <Text>{move}</Text>
                  <Text>{success}</Text>
                  <Text>{totalFit}</Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              m="20px 0"
              justify="start"
              align="center"
              w="40%"
            >
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
            </Flex>
          </Flex>

          <Grid key={gridKey} grid={grid} robot={robot} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Trash;
