import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.scss";

import Demo1 from "./demo1";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Link to="/TorusKnot">TorusKnot</Link>
        </div>
        <Switch>
          <Route path={["/TorusKnot", "/"]}>
            <Demo1 />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
