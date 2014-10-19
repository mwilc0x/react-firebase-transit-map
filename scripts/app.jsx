/** @jsx React.DOM */

'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var routes = require('../data/hubs.json');
window.React = React;

var GoogleFirebaseTransitMap = require('./map-component.jsx');

console.log(routes);

/**
* Render a simple demo withe the map component
* and a bootstrap dropdown
*/
var Demo = React.createClass({

  getInitialState: function() {
    return {
      items: routes,
      city: "cities"
     };
  },

  itemSelect: function(key) {
    
    var update = React.addons.update(this.state, {
      city: { $set: key }});

    this.setState(update);

  },

  render: function() {

    var menuItems = this.state.items.transitSystems.map(function(item, i) {
      return (
        <MenuItem key={item.name} onSelect={this.itemSelect}>{item.name}</MenuItem>
      );
    }, this);

    return (
      <div>
        <DropdownButton bsStyle="Default" title={this.state.city}>
            {menuItems}
        </DropdownButton>
        <GoogleFirebaseTransitMap></GoogleFirebaseTransitMap>
      </div>
    );
  }
});

React.renderComponent(<Demo />, document.getElementById('content'));
