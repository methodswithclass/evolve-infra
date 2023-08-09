import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { overrideConsole } from './app/utils/utils';
import Routes from './app/routes';
import { ChakraProvider } from '@chakra-ui/react';
import './styles/index.scss';

function App() {
  const { REACT_APP_ENV: env } = process.env;
  if (env !== 'local') {
    overrideConsole();
  }
  return (
    <ChakraProvider>
      <BrowserRouter basename="/">
        <Routes />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
