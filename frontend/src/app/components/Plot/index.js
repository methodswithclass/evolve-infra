import Point from './Point';
import { min, max } from '../../utils/utils';

const Plot = (props) => {
  const { points } = props;

  const minPoint = min(points);
  const maxPoint = max(points);
  //   const maxPoint = 200;

  return (
    <div className="points">
      {points?.map((item, index) => (
        <Point
          index={(index / points.length) * 100}
          value={((item - minPoint) / (maxPoint - minPoint)) * 100}
        />
      ))}
    </div>
  );
};

export default Plot;
