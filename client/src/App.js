import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Pages
import Main from "./containers/Main";
import Login from "./containers/Login";
import Forgot from "./containers/Forgot";
import Settings from "./containers/SettingsPage";
import SignUp from "./containers/SignUp";
import Message from "./containers/Message";

// Routes
export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} exact />
        <Route path="/send-message" component={Message} exact />
        <Route path="/settings" component={Settings} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={SignUp} />
        <Route path="/password-reset" component={Forgot} />
      </Switch>
    </Router>
  );
}
