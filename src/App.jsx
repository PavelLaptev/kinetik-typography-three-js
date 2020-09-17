import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styles from "./app.module.scss";

import Demo1 from "./demo1";
import Demo2 from "./demo2";
import Demo3 from "./demo3";

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <Switch>
          <Route path="/Demo3">
            <Demo3 />
          </Route>
          <Route path="/Donut">
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
