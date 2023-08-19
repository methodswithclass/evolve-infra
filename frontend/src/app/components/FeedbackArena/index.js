import React from 'react';
import Plot from '../Plot';
import { checkMobile } from '../../utils/utils';

const Feedback = (props) => {
  const { best } = props;

  const isMobile = checkMobile();

  return (
    <div className={`${isMobile ? 'feedbackArena-mobile' : 'feedbackArena'}`}>
      <Plot minY={0} maxY={100} points={best?.strategy} />
    </div>
  );
};

export default Feedback;
