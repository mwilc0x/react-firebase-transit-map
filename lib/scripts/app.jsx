/** @jsx React.DOM */

'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var GoogleMapsAPI = window.google.maps;
var LatLng = GoogleMapsAPI.LatLng;
var routes = require('../../data/hubs.json');
window.React = React;

var GoogleFirebaseTransitMap = require('./components/map-component.jsx');
var Store = require("./store/store.jsx");

var store = new Store();

/**
* Render a simple demo withe the map component
* and a bootstrap dropdown
*/
var Demo = React.createClass({

  getInitialState: function() {
    return {
      items: routes,
      hub: "Los Angeles Rail",
      center: {},
      id: 'lametro-rail'
     };
  },

  itemSelect: function(hub) {

    var routes = this.state.items.transitSystems,
        i,
        center,
        update,
        id;

    for(i = 0; i < routes.length; i++) {
      if(routes[i].name === hub)
        break;
    }

    center = new LatLng(routes[i].lat, routes[i].lon);
    id = routes[i].tag;

    //store.update(center);

    update = React.addons.update(this.state, {
      hub: { $set: hub },
      id: { $set: id},
      center: { $set: center }
    });

    this.setState(update);

  },

  componentDidMount: function() {
    store.on("change", function() {
      this.setState(this._getStateFromStore());
    }.bind(this))
  },

  render: function() {

    var menuItems = this.state.items.transitSystems.map(function(item, i) {
      return (
        <MenuItem key={item.name} onSelect={this.itemSelect.bind(this, item.name)}>{item.name}</MenuItem>
      );
    }, this);

    return (
      <div>
        <DropdownButton bsStyle="Default" title={this.state.hub}>
            {menuItems}
        </DropdownButton>
        <GoogleFirebaseTransitMap center={this.state.center} id={this.state.id}></GoogleFirebaseTransitMap>
      </div>
    );
  },

  _getStateFromStore: function() {
    return {
      center: store.center
    }
  }
});

React.renderComponent(<Demo />, document.getElementById('content'));
