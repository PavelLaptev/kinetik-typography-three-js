import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import styles from "./app.module.scss";

import Demo1 from "./demo1";
import Demo2 from "./demo2";
import Demo3 from "./demo3";
import Demo4 from "./demo4";
import Demo5 from "./demo5";
import Demo6 from "./demo6";
import Demo7 from "./demo7";

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <Switch>
          <Route path="/waterfall">
            <Demo7 />
          </Route>
          <Route path="/cube">
            <Demo6 />
          </Route>
          <Route path="/sphere">
            <Demo5 />
          </Route>
          <Route path="/spiral">
            <Demo4 />
          </Route>
          <Route path="/donutstripes">
            <Demo3 />
          </Route>
          <Route path="/donut">
            <Demo2 />
          </Route>
          <Route path={["/torusknot", "/"]}>
            <Demo1 />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
