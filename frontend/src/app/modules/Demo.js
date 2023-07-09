import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, send, subscribe } from '../services/api-service';

const Demo = () => {
  const [count, setCount] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  const handleRun = () => {
    send('run', { total: 10 });
  };

  const handleResponse = (data) => {
    console.log('debug data', data);
    setCount(data.count);
  };

  useEffect(() => {
    const close = connect();
    const unsub = subscribe('run', handleResponse);

    return () => {
      close();
      unsub();
    };
  }, []);

  return (
    <div>
      Demo
      <button onClick={handleBack}>Back</button>
      <button onClick={handleRun}>Run</button>
      current count: {count}
    </div>
  );
};

export default Demo;
