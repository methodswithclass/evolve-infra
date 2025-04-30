import Robot from "./Robot";

const Block = (props) => {
  const { block, robot, pos, size } = props;

  return (
    <div className="block" style={size}>
      <div
        style={{
          ...size,
          position: "absolute",
          backgroundColor: block > 0 ? "red" : "gray",
          opacity: block === 2 ? 0.3 : 1,
        }}
      />
      {pos.x === robot.x && pos.y === robot.y ? (
        <div style={{ ...size, position: "absolute" }}>
          <Robot />
        </div>
      ) : null}
    </div>
  );
};

export default Block;
