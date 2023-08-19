import React from 'react';
import Header from '../components/Header';
import { checkMobile } from '../utils/utils';

const Home = () => {
  const isMobile = checkMobile();
  return (
    <div className="home">
      <Header />
      <div className="body">
        <span>Welcome to the evolutionary algorithm demo</span>
        <span className="subtitle">
          <>
            {isMobile
              ? 'Open the menu on the right to see the demos'
              : 'Click an option above to open the demos'}
          </>
        </span>
      </div>
    </div>
  );
};

export default Home;
