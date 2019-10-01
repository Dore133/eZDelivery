import React, { Component } from 'react';
import Header from './Components/Nav/NavBar.js';
import Home from './Components/HomeScreens/Home.js';
import KDP from './Components/HomeScreens/KDPHome.js';
import Pioneer from './Components/HomeScreens/PioneerHome.js';
import cartPioneer from './Components/Pioneer/cartPioneer.js';
import trackPioneer from './Components/Pioneer/trackPioneer.js';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { compose } from 'redux';
import { GoogleApiWrapper } from 'google-maps-react';
import { geolocated } from 'react-geolocated'

class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/ui/KDP" component={KDP} />
            <Route exact path="/ui/Pioneer" component={Pioneer} />
            <Route exact path="/cart/Pioneer" component={cartPioneer} />
            <Route exact path="/track/Pioneer/:orderNumber" component={trackPioneer} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

function NoMatch(){
  return(
    <div className="container">
      <h1 className="flow-text">
        No Match Found Go To
        <Link to="/"> Home</Link>
      </h1>
    </div>
  )
}

export default compose(
  geolocated({
      positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 60000
    },
    watchPosition: true,
    userDecisionTimeout: 30000,
    suppressLocationOnMount: false,
    geolocationProvider: navigator.geolocation
  }),
  GoogleApiWrapper({
    apiKey: 'AIzaSyDl3ed_01AJddUuFzJuPoX-LScqqB6nkT4',
    region: 'KN',
    LoadingContainer: <div className="progress"><div className="indeterminate"></div></div>
  })
)(App)
