import Home from '../modules/Home';
import Demo from '../modules/Demo';
import Root from '../modules/Root';

const RouteMap = [
  {
    id: 'home',
    path: 'home',
    component: Home,
  },
  {
    id: 'demo',
    path: 'demo',
    component: Demo,
  },
  {
    id: 'default',
    path: '*',
    component: Root,
  },
];

export default RouteMap;
