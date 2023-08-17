import React, { useState, useEffect, useCallback } from 'react';
import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Progress,
} from '@chakra-ui/react';
import { connect, send, subscribe } from '../../services/api-service';
import { checkMobile } from '../../utils/utils';

let timer;
const width = 200;
const beginActions = 0;
const size = 5;
const totalSteps = beginActions > 0 ? 70 : size * size * 2;
const refreshTime = 900 - 60;

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
  const [refreshTime, setRefreshTime] = useState(null);
  const [running, setRunning] = useState(false);
  const [final, setFinal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isMobile = checkMobile();

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
      setter: setHistory,
      value: [],
    },
  ];

  const handleRun = useCallback(() => {
    const data = {
      params: {
        demo: name,
        geneTotal: name === 'trash' ? trashTotal + beginActions : 100,
        newValue: 50,
        maxValue: 100,
        size,
        condition: 0.5,
        totalRuns: 20,
        totalSteps,
        start: 'origin',
        beginActions,
        fitType: 'total',
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
    send('run', data);
  }, [first, total, best]);

  const handleStop = (e) => {
    if (e === true) {
      setIsRefreshing(true);
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
      const {
        generation: curr,
        best,
        final: finalFromResponse,
        message,
      } = data;
      if (message) {
        console.log('debug error in evolve', message);
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
        console.log('debug stop auto');
        setDisableRun(false);
        setRunning(false);
      }
    },
    [total, history]
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
    <div className={name}>
      <Flex w="100%" h="100%" flexDirection={`column`} align="center">
        <Flex
          m={20}
          w="100%"
          h="100%"
          flexDirection={`${isMobile ? 'column' : 'row'}`}
          align="center"
          justify="center"
        >
          <Flex w="30%" h="100%" flexDirection="column" align="center">
            <FormControl m={2} w={width}>
              <FormLabel>Total</FormLabel>
              <Input value={total} onChange={handleTotal} />
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
          <Flex
            w={`${isMobile ? '80%' : '30%'}`}
            flexDirection="column"
            align="center"
          >
            <Text m={2}>total: {total}</Text>
            <Text m={2}>generation: {current}</Text>
            <Text m={2}>fitness: {best?.fitness}</Text>
            <Progress w="100%" h={30} value={(current / total) * 100} />
          </Flex>
        </Flex>
        <Arena
          best={best}
          history={history}
          totalSteps={totalSteps}
          beginActions={beginActions}
        />
      </Flex>
    </div>
  );
};

export default Demo;
