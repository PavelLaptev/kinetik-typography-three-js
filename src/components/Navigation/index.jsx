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
        <NavLink className={styles.link} to="/torusknot" activeStyle={isActive}>
          TorusKnot
        </NavLink>
        <NavLink className={styles.link} to="/donut" activeStyle={isActive}>
          Donut
        </NavLink>
        <NavLink
          className={styles.link}
          to="/donutstripes"
          activeStyle={isActive}
        >
          Donut Stripes
        </NavLink>
        <NavLink className={styles.link} to="/spiral" activeStyle={isActive}>
          Spiral
        </NavLink>
        <NavLink className={styles.link} to="/sphere" activeStyle={isActive}>
          Sphere
        </NavLink>
        <NavLink className={styles.link} to="/cube" activeStyle={isActive}>
          Cube
        </NavLink>
        <NavLink className={styles.link} to="/waterfall" activeStyle={isActive}>
          Waterfall
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
      <div className={styles.linksBlock}>
        <a
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/PavelLaptev/kinetik-typography-three-js"
        >
          Github
        </a>
        <a
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          href="https://medium.com/@PavelLaptev/kinetictypography-with-threejs-2bed948720a2"
        >
          Article
        </a>
      </div>
    </section>
  );
});

export default Navigation;
