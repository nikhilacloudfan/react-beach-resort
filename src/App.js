import React from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import SingleRoom from './pages/SingleRoom';
import Error from './pages/Error';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} exact></Route>
        <Route path="/rooms" component={Rooms} exact></Route>
        <Route path="/rooms/:slug" component={SingleRoom} exact></Route>
        <Route component={Error}></Route>
      </Switch>
    </div>
  );
}

export default App;
