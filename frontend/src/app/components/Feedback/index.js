import React from 'react';
import Plot from '../Plot';

const Feedback = (props) => {
  const { best } = props;

  return (
    <div className="feedbackArena">
      <Plot points={best?.dna} />
    </div>
  );
};

export default Feedback;
