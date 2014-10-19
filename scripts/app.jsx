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
  render: function() {
    return (
      <div>
        <DropdownButton bsStyle="Default" title="Cities">
          <MenuItem key="1">todo</MenuItem>
          <MenuItem key="2">todo</MenuItem>
        </DropdownButton>
        <GoogleFirebaseTransitMap></GoogleFirebaseTransitMap>
      </div>
    );
  }
});

React.renderComponent(<Demo />, document.getElementById('content'));
