import React from "react";
import styles from "./rangecontrol.module.scss";

const Input = React.forwardRef((props, ref) => {
  const [val, setVal] = React.useState(props.val || 0);

  const handleOnChange = (e) => {
    setVal(e.target.value);
  };

  const returnInput = () => {
    if (props.type === "range") {
      return (
        <input
          onChange={handleOnChange}
          className={styles.range}
          type="range"
          min={props.min}
          max={props.max}
          value={val}
          ref={ref}
          step={props.step}
        />
      );
    }
    if (props.type === "text") {
      return (
        <input
          onChange={handleOnChange}
          className={styles.range}
          type="text"
          maxLength="20"
          value={val}
          ref={ref}
        />
      );
    }
  };

  return (
    <div className={styles.wrap}>
      <label>{props.label}</label>
      {returnInput()}
    </div>
  );
});

export default Input;
