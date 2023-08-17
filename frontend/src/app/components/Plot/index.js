import Point from './Point';
import { min, max } from '../../utils/utils';

const Plot = (props) => {
  const { points, maxY, minY } = props;

  const minYPoints = min(points);

  const minPoint =
    minY >= 0 && !Number.isNaN(minY)
      ? minY
      : minYPoints + (minYPoints / Math.abs(minYPoints)) * 4;
  const maxPoint = maxY >= 0 && !Number.isNaN(maxY) ? maxY : max(points) + 4;

  return (
    <div className="points">
      {points?.map((item, index) => (
        <Point
          key={`${item}#${index}`}
          x={index}
          y={item}
          index={(index / points.length) * 100 * 0.9 + (100 - 90) / 2}
          value={
            ((item - minPoint) /
              (maxPoint !== minPoint ? maxPoint - minPoint : 1)) *
            100
          }
        />
      ))}
    </div>
  );
};

export default Plot;
