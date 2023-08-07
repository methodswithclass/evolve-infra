import React, { useState, useEffect, useCallback } from 'react';
import Header from '../Header';
import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Progress,
} from '@chakra-ui/react';
import { connect, send, subscribe } from '../../services/api-service';

let timer;
const width = 200;
const beginActions = 10;
const refreshTime = 900 - 60;
// const refreshTime = 10;

const getRefreshTime = () => new Date().getTime() + refreshTime * 1000;

const getCurrentTime = () => new Date().getTime();

const Demo = (props) => {
  const { name, arena: Arena, total: trashTotal } = props;
  const [first, setFirst] = useState(1);
  const [total, setTotal] = useState(2000);
  const [current, setCurrent] = useState(first);
  const [disableRun, setDisableRun] = useState(false);
  const [best, setBest] = useState({ fitness: 0 });
  const [history, setHistory] = useState([]);
  const [type, setType] = useState('other');
  const [refreshTime, setRefreshTime] = useState(null);
  const [running, setRunning] = useState(false);
  const [final, setFinal] = useState(false);
  const [clickedStop, setClickedStop] = useState(false);

  const clearTimer = () => {
    console.log('debug clear timer', timer);
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
      setter: setType,
      value: 'other',
    },
    {
      setter: setHistory,
      value: [],
    },
  ];

  const handleRun = useCallback(() => {
    const data = {
      options: {
        demo: name,
        type,
        first,
        best,
        totalGen: total,
        totalPop: 100,
        totalLength: name === 'trash' ? trashTotal + beginActions : 100,
        size: 5,
        condition: 0.5,
        totalRuns: 10,
        totalSteps: 500,
        start: 'random',
        beginActions,
        fitType: 'total',
      },
    };
    setDisableRun(true);
    setFinal(false);
    setClickedStop(false);
    setRefreshTime(getRefreshTime());
    setRunning(true);
    send('run', data);
  }, [first, total, best, type]);

  const handleStop = (e) => {
    if (e) {
      setClickedStop(true);
      setDisableRun(false);
    }
    send('stop');
  };

  const handleReset = () => {
    initial.forEach(({ value, setter }) => {
      setter(value);
    });
  };

  const handleResponse = useCallback(
    (data) => {
      console.log('debug data', data);
      const { epoch: curr, best, final: finalFromResponse } = data;
      setCurrent(curr);
      setFirst(curr + 1);
      setBest(best);
      setHistory((prevHistory) => [...prevHistory, best.fitness]);
      setFinal(finalFromResponse);
      if (curr === total - 1) {
        console.log('debug stop auto');
        setDisableRun(false);
        setRunning(false);
      }
    },
    [total]
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
    const unsubRun = subscribe('run', handleResponse);
    return () => {
      unsubRun();
    };
  }, [handleResponse]);

  useEffect(() => {
    if (!timer && running) {
      timer = setInterval(() => {
        console.log('debug timer');
        if (running) {
          console.log('debug timer running');
          const mill = getCurrentTime();
          if (mill > refreshTime) {
            handleStop();
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
      if (clickedStop) {
        setRunning(false);
        clearTimer();
        return;
      }

      handleRun();
    }
  }, [running, final, clickedStop]);

  return (
    <div className={name}>
      <Header active={name} />
      <Flex w="100%" h="100%" flexDirection="column" align="center">
        <Arena best={best} history={history} beginActions={beginActions} />
        <Flex
          m={20}
          w="100%"
          h="100%"
          flexDirection="row"
          align="center"
          justify="center"
        >
          <Flex w="30%" h="100%" flexDirection="column" align="center">
            <FormControl m={2} w={width}>
              <FormLabel>Total</FormLabel>
              <Input value={total} onChange={handleTotal} />
            </FormControl>
            <FormControl m={2} w={width}>
              <FormLabel>Type</FormLabel>
              <RadioGroup value={type} onChange={setType}>
                <Stack direction="column">
                  <Radio value="other">Other</Radio>
                  <Radio value="split">Split</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <Button m={2} w={width} isDisabled={disableRun} onClick={handleRun}>
              Run
            </Button>
            <Button m={2} w={width} onClick={handleStop}>
              Stop
            </Button>
            <Button
              m={2}
              w={width}
              isDisabled={disableRun}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Flex>
          <Flex w="30%" flexDirection="column" align="center">
            <Text m={2}>type: {type}</Text>
            <Text m={2}>total: {total}</Text>
            <Text m={2}>gen: {current}</Text>
            <Text m={2}>fitness: {best.fitness}</Text>
            <Progress w="100%" h={30} value={(current / total) * 100} />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default Demo;
