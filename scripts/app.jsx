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
    return { items: routes };
  },

  render: function() {

    var menuItems = this.state.items.transitSystems.map(function(item, i) {
      return (
        <MenuItem key={item.tag}>{item.name}</MenuItem>
      );
    }, this);

    return (
      <div>
        <DropdownButton bsStyle="Default" title="Cities">
            {menuItems}
        </DropdownButton>
        <GoogleFirebaseTransitMap></GoogleFirebaseTransitMap>
      </div>
    );
  }
});

React.renderComponent(<Demo />, document.getElementById('content'));
