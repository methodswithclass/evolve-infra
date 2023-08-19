import Home from '../modules/Home';
import Feedback from '../modules/Feedback';
import TrashPickup from '../modules/TrashPickup';
import TrashEx from '../modules/TrashPickupEx';
import Root from '../modules/Root';

const RouteMap = [
  {
    id: 'home',
    title: 'Home',
    path: 'home',
    component: Home,
  },
  {
    id: 'feedback',
    title: 'Feedback',
    path: 'feedback',
    component: Feedback,
    menu: true,
  },
  {
    id: 'trash',
    title: 'Trash Pickup',
    path: 'trash-pickup',
    component: TrashPickup,
    menu: true,
  },
  // {
  //   id: 'trash-ex',
  //   title: 'Trash Experimental',
  //   path: 'trash-pickup-ex',
  //   component: TrashEx,
  //   menu: true,
  // },
  {
    id: 'default',
    title: 'Root',
    path: '*',
    component: Root,
  },
];

export default RouteMap;
