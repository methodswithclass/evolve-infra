import Home from '../modules/Home';
import Feedback from '../modules/Feedback';
import TrashPickup from '../modules/TrashPickup';
import Root from '../modules/Root';

const RouteMap = [
  {
    id: 'home',
    path: 'home',
    component: Home,
  },
  {
    id: 'feedback',
    path: 'feedback',
    component: Feedback,
  },
  {
    id: 'trash',
    path: 'trash-pickup',
    component: TrashPickup,
  },
  {
    id: 'default',
    path: '*',
    component: Root,
  },
];

export default RouteMap;
