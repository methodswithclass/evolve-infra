import { BrowserRouter } from 'react-router-dom';
import Routes from './app/routes';
import { ChakraProvider } from '@chakra-ui/react';
import './styles/index.scss';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter basename="/">
        <Routes />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
