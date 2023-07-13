import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, send, subscribe } from '../services/api-service';

const Demo = () => {
  const [fitness, setFitness] = useState(0);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  const handleRun = () => {
    send('run', { total: 10 });
  };

  const handleStop = () => {
    send('stop');
  };

  const handleResponse = (data) => {
    console.log('debug data', data);
    setFitness(data.best.fitness);
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
    <div>
      Demo
      <button onClick={handleBack}>Back</button>
      <button onClick={handleRun}>Run</button>
      <button onClick={handleStop}>Stop</button>
      current fitness: {fitness}
    </div>
  );
};

export default Demo;
