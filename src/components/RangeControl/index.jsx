import React from "react";
import styles from "./rangecontrol.module.scss";

const RangeControl = React.forwardRef((props, ref) => {
  const [val, setVal] = React.useState(10);

  const handleOnChange = (e) => {
    setVal(e.target.value);
  };

  return (
    <input
      onChange={handleOnChange}
      className={styles.range}
      type="range"
      min={props.min}
      max={props.max}
      value={val}
      ref={ref}
    />
  );
});

export default RangeControl;
