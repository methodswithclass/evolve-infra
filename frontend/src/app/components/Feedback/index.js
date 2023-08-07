import React from 'react';
import Plot from '../Plot';

const Feedback = (props) => {
  const { best } = props;

  return (
    <div className="feedbackArena">
      <Plot minY={0} maxY={100} points={best?.dna} />
    </div>
  );
};

export default Feedback;
