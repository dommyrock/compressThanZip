import { memo } from "react";

const ProgressBar = (props) => {
  const { completed } = props;

  return (
    <div className="progress-container">
      <div className="progress-fill" style={{ width: `${completed}%` }}>
        <span className=" progress-label">{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default memo(ProgressBar);

//For non primitive data structures like objects, array ,functions memo does shallow comparison (reference in memory )
// If i had CB function passed as prop i would neeed >useCallbact to memoize it
// (else it would cause rerendeing of this child even if i changed something non relted in parent)
//For computed values that take long time --> useMemo
