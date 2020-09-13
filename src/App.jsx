import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styles from "./app.module.scss";

import Demo1 from "./demo1";
import Demo2 from "./demo2";

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <div className={styles.navigation}>
          <Link className={styles.link} to="/TorusKnot">
            TorusKnot
          </Link>
          <Link className={styles.link} to="/demo2">
            Demo2
          </Link>
        </div>

        <Switch>
          <Route path="/demo2">
            <Demo2 />
          </Route>
          <Route path={["/TorusKnot", "/"]}>
            <Demo1 />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
