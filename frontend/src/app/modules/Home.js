import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/demo');
  };

  return (
    <div>
      Home
      <button onClick={handleClick}>Demo</button>
    </div>
  );
};

export default Home;
