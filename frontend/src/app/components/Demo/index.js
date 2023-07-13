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

const width = 200;

const Demo = (props) => {
  const { name, arena: Arena } = props;
  const [first, setFirst] = useState(1);
  const [total, setTotal] = useState(200);
  const [current, setCurrent] = useState(first);
  const [disableRun, setDisableRun] = useState(false);
  const [best, setBest] = useState({ fitness: 0 });
  const [type, setType] = useState('other');

  const initial = [
    {
      setter: setFirst,
      value: 1,
    },
    {
      setter: setTotal,
      value: 200,
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
        totalLength: 100,
      },
    };
    setDisableRun(true);
    send('run', data);
  }, [first, total, best, type]);

  const handleStop = () => {
    setDisableRun(false);
    send('stop');
  };

  const handleReset = () => {
    initial.forEach(({ value, setter }) => {
      setter(value);
    });
  };

  const handleResponse = (data) => {
    console.log('debug data', data);
    const { epoch: curr, best } = data;
    if (curr === total - 1) {
      setDisableRun(false);
    }
    setCurrent(curr);
    setFirst(curr + 1);
    setBest(best);
  };

  const handleTotal = (e) => {
    setTotal(e.target.value);
  };

  useEffect(() => {
    const close = connect();
    const unsubRun = subscribe('run', handleResponse);

    return () => {
      close();
      unsubRun();
    };
  }, []);

  return (
    <div className={name}>
      <Header active={name} />
      <Flex flexDirection="column" align="center">
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
        <Arena best={best} />
      </Flex>
    </div>
  );
};

export default Demo;
