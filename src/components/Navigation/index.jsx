import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./navigation.module.scss";

const Navigation = React.forwardRef((props, ref) => {
  const [showControls, setShowControls] = React.useState(true);

  const CSSVars = {
    "--main-clr": props.colors.main,
    "--second-clr": props.colors.second,
    "--third-clr": props.colors.third,
  };

  const isActive = {
    color: "var(--second-clr)",
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <section className={styles.wrap} style={CSSVars}>
      <div className={styles.menu}>
        <NavLink className={styles.link} to="/TorusKnot" activeStyle={isActive}>
          TorusKnot
        </NavLink>
        <NavLink className={styles.link} to="/Donut" activeStyle={isActive}>
          Donut
        </NavLink>
        <NavLink
          className={styles.link}
          to="/Donut Stripes"
          activeStyle={isActive}
        >
          Donut Stripes
        </NavLink>
        <NavLink className={styles.link} to="/Spiral" activeStyle={isActive}>
          Spiral
        </NavLink>
        <NavLink className={styles.link} to="/Demo5" activeStyle={isActive}>
          Demo5
        </NavLink>
      </div>
      <div className={styles.controls}>
        <div
          className={styles.toggleControls}
          style={
            showControls
              ? null
              : {
                  backgroundColor: "transparent",
                  border: "2px var(--main-clr) solid",
                  color: "var(--main-clr)",
                }
          }
          onClick={toggleControls}
        >
          {showControls ? "Hide controls ⤒" : "Show controls ⤓"}
        </div>
        <div
          className={styles.inputs}
          style={{ display: showControls ? null : "none" }}
        >
          {props.inputs}
        </div>
      </div>
    </section>
  );
});

export default Navigation;
