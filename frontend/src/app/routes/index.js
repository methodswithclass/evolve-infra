import { Routes, Route } from 'react-router-dom';
import RouteMap from './route-map';

function Index() {
  return (
    <Routes>
      {RouteMap.map(({ path, component: RouteComponent }) => (
        <Route key={`${path}key`} path={path} element={<RouteComponent />} />
      ))}
    </Routes>
  );
}

export default Index;
