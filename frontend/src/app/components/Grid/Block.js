import Robot from "./Robot";

const Block = (props) => {
  const { block, robot, pos, size } = props;

  return (
    <div
      className="block"
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    >
      <div
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          position: "absolute",
          backgroundColor: block === 1 ? "red" : block === 2 ? "green" : "gray",
          opacity: block === 2 ? 0.3 : 1,
        }}
      >{`${pos.x} ${pos.y}`}</div>
      {pos.x === robot.x && pos.y === robot.y ? (
        <div
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            position: "absolute",
          }}
        >
          <Robot size={size.width * 0.8} />
        </div>
      ) : null}
    </div>
  );
};

export default Block;
