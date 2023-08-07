import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/home');
  }, []);

  return <div>Loading....</div>;
};

export default Root;
