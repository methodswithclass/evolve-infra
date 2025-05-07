import React, { useState, useEffect, useCallback } from "react";
import { Flex, Button, Field, Text, Input, Progress } from "@chakra-ui/react";
import { connect, send, subscribe } from "../../services/api-service";
import { checkMobile, formatNumber } from "../../utils/utils";
import { blue1 } from "../../utils/constants";
import Select from "../Select";

let timer;
const width = 200;
const refreshTime = 900 - 60;

const getRefreshTime = () => new Date().getTime() + refreshTime * 1000;

const getCurrentTime = () => new Date().getTime();

const Demo = (props) => {
  const { name, arena: Arena, total: trashTotal } = props;
  const [first, setFirst] = useState(1);
  const [total, setTotal] = useState(2000);
  const [current, setCurrent] = useState(first);
  const [disableRun, setDisableRun] = useState(true);
  const [best, setBest] = useState({ fitness: 0 });
  const [history, setHistory] = useState([]);
  const [refreshTime, setRefreshTime] = useState(null);
  const [running, setRunning] = useState(false);
  const [final, setFinal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [size, setSize] = useState(5);

  const totalSteps = size * size * 2;

  const onChange = (e) => {
    setSize(e?.value?.[0]);
  };

  const clearTimer = () => {
    console.log("debug clear timer", timer);
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const initial = [
    {
      setter: setFirst,
      value: 1,
    },
    {
      setter: setTotal,
      value: 2000,
    },
    {
      setter: setCurrent,
      value: 1,
    },
    {
      setter: setBest,
      value: { fitness: 0 },
    },
    {
      setter: setHistory,
      value: [],
    },
  ];

  const handleRun = useCallback(() => {
    const data = {
      params: {
        demo: name,
        geneTotal: name === "feedback" ? 100 : trashTotal,
        newValue: 50,
        maxValue: 100,
        size,
        trashRate: 0.5,
        totalRuns: 20,
        totalSteps,
        start: "random",
        fitType: "total",
        first,
        last: total,
        best,
        popTotal: 100,
      },
    };
    setDisableRun(true);
    setFinal(false);
    setIsRefreshing(false);
    setRefreshTime(getRefreshTime());
    setRunning(true);
    send("run", data);
  }, [first, total, best]);

  const handleStop = (e) => {
    if (e === true) {
      setIsRefreshing(true);
    }
    send("stop");
  };

  const handleReset = () => {
    initial.forEach(({ value, setter }) => {
      setter(value);
    });
  };

  const handleConnected = () => {
    setDisableRun(false);
  };

  const handleResponse = useCallback(
    (data) => {
      const {
        generation: curr,
        best,
        final: finalFromResponse,
        message,
      } = data;
      if (message) {
        console.log("debug error in evolve", message);
        setDisableRun(false);
        setRunning(false);
        return;
      }
      setCurrent(curr);
      setFirst(curr + 1);
      setBest(best);
      setHistory((prevHistory) => [...prevHistory, best?.fitness]);
      setFinal(finalFromResponse);
      if (curr === total - 1) {
        console.log("debug stop auto");
        setDisableRun(false);
        setRunning(false);
      }
    },
    [total, history, name]
  );

  const handleTotal = (e) => {
    setTotal(e.target.value);
  };

  useEffect(() => {
    const close = connect();
    return () => {
      close();
    };
  }, []);

  useEffect(() => {
    const unsubConnected = subscribe("connected", handleConnected);
    const unsubRun = subscribe("run", handleResponse);
    return () => {
      unsubConnected();
      unsubRun();
    };
  }, [handleResponse]);

  useEffect(() => {
    if (!timer && running) {
      timer = setInterval(() => {
        if (running) {
          const mill = getCurrentTime();
          if (mill >= refreshTime) {
            handleStop(true);
            clearTimer();
          }
        } else {
          clearTimer();
        }
      }, [1000]);
    }

    return clearTimer;
  }, [running, refreshTime]);

  useEffect(() => {
    if (running && final) {
      setFinal(false);
      if (!isRefreshing) {
        setRunning(false);
        setDisableRun(false);
        clearTimer();
        return;
      }

      handleRun();
    }
  }, [running, final, isRefreshing]);

  return (
    <div className="demo">
      <Flex w="100%" direction="column" align="center">
        <Flex
          m="100px 0"
          w="100%"
          direction="column"
          align="center"
          justify="center"
        >
          <Flex
            w={width}
            h="100%"
            direction="column"
            justify="center"
            align="center"
          >
            <Text m="0 0 10px 0">Total Generations</Text>
            <Input value={total} onChange={handleTotal} />
            <Text m="20px 0 10px 0">Train against</Text>
            <Select
              height="200px"
              items={[
                { label: "5", value: 5 },
                { label: "10", value: 10 },
                { label: "20", value: 20 },
              ]}
              value={size}
              onChange={onChange}
            />
            <Button
              m="20px"
              w={width}
              disabled={disableRun}
              onClick={handleRun}
              bgColor={blue1}
            >
              Train
            </Button>
            <Button m="20px" w={width} onClick={handleStop} bgColor={blue1}>
              Stop
            </Button>
            <Button
              m="20px"
              w={width}
              disabled={disableRun}
              onClick={handleReset}
              bgColor={blue1}
            >
              Reset
            </Button>
          </Flex>
          <Flex w="80%" m="50px 0 20px 0" direction="column" align="center">
            <Flex direction="row" w="100%" justify="start" align="center">
              <Text w="50%" padding="0 20px" textAlign="end">
                total:
              </Text>
              <Text w="50%" padding="0 20px">
                {total}
              </Text>
            </Flex>
            <Flex direction="row" w="100%" justify="center" align="center">
              <Text w="50%" padding="0 20px" textAlign="end">
                generation:
              </Text>
              <Text w="50%" padding="0 20px">
                {current}
              </Text>
            </Flex>
            <Flex direction="row" w="100%" justify="center" align="center">
              <Text w="50%" padding="0 20px" textAlign="end">
                fitness:
              </Text>
              <Text w="50%" padding="0 20px">
                {formatNumber(`${best?.fitness}`)}
              </Text>
            </Flex>
            <Progress.Root w="100%" m="50px 0" value={(current / total) * 100}>
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Flex>
        </Flex>
        <Arena best={best} history={history} totalSteps={totalSteps} />
      </Flex>
    </div>
  );
};

export default Demo;
