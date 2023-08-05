import Point from './Point';
import { min, max } from '../../utils/utils';

const Plot = (props) => {
  const { points, maxY, minY } = props;

  const minPoint = !Number.isNaN(minY) ? minY : min(points);
  const maxPoint = !Number.isNaN(maxY) ? maxY : max(points);

  return (
    <div className="points">
      {points?.map((item, index) => (
        <Point
          key={`${item}#${index}`}
          x={index}
          y={item}
          index={(index / points.length) * 100}
          value={((item - minPoint) / (maxPoint - minPoint)) * 100}
        />
      ))}
    </div>
  );
};

export default Plot;
