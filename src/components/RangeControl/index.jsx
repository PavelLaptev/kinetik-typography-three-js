import React from "react";
import styles from "./rangecontrol.module.scss";

const RangeControl = (props) => {
  const [val, setVal] = React.useState(10);

  const handleOnChange = (e) => {
    setVal(e.target.value)
    props.onChange(e)
  }
  
  return (
        <input onChange={handleOnChange} className={styles.range} type="range" min={props.min} max={props.max} value={val} />
  );
};

export default RangeControl;
