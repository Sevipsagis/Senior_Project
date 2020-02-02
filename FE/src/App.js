import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Containers/Home';
import User from './Containers/User';
import NotFound from './Containers/NotFound';
import Register from './Containers/Register';
import Edit from './Containers/Edit';
import Setting from './Containers/Setting';
import Profile from './Containers/Profile';
class App extends React.Component {

  renderRouter() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/profile" component={User} />
        <Route exact path="/all" component={User} />
        <Route exact path="/profile/:id" component={Profile} />
        <Route exact path="/view/:id" component={Edit} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/edit/:id" component={Edit} />
        <Route exact path="/setting" component={Setting} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  render() {
    return (
      <BrowserRouter>
        {this.renderRouter()}
      </BrowserRouter>
    );
  }
}

export default App;
