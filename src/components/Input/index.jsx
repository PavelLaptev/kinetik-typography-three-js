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
        <>
          <label className={styles.labelRange}>{props.label}</label>
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
        </>
      );
    }
    if (props.type === "text") {
      return (
        <>
          <label className={styles.labelText}>{props.label}</label>
          <input
            onChange={handleOnChange}
            className={styles.text}
            type="text"
            maxLength="20"
            value={val}
            ref={ref}
          />
        </>
      );
    }
  };

  return <div className={styles.wrap}>{returnInput()}</div>;
});

export default Input;
