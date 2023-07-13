import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/demo');
  };

  return (
    <div className="home">
      <Header />
      <div className="body">
        <span>Welcome to the evolutionary algorithm demo</span>
        <span className="subtitle">
          Click an option above to open the demos
        </span>
      </div>
    </div>
  );
};

export default Home;
