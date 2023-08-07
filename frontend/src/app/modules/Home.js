import React from 'react';
import Header from '../components/Header';

const Home = () => {
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
