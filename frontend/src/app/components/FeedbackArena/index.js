import React from "react";
import Plot from "../Plot";

const Feedback = (props) => {
  const { best } = props;

  return <Plot name="feedback" minY={0} maxY={100} points={best?.strategy} />;
};

export default Feedback;
