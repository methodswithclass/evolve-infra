import { BrowserRouter } from 'react-router-dom';
import Routes from './app/routes';
import './styles/index.scss';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes />
    </BrowserRouter>
  );
}

export default App;
