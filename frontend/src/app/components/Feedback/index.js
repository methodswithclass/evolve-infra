import React from 'react';
import Point from './Point';

const Feedback = (props) => {
  const { best } = props;

  return (
    <div className="feedbackArena">
      <div className="points">
        {best?.dna?.map((item, index) => (
          <Point index={index} value={item} />
        ))}
      </div>
    </div>
  );
};

export default Feedback;
