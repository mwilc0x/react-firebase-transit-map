/** @jsx React.DOM */

'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
window.React = React;

var GoogleFirebaseTransitMap = require('./map-component.jsx');

/**
* Render a simple demo withe the map component
* and a bootstrap dropdown
*/
var Demo = React.createClass({
  render: function() {
    return (
      <div>
        <DropdownButton bsStyle="Default" title="Cities">
          <MenuItem key="1">Action</MenuItem>
          <MenuItem key="2">Another action</MenuItem>
          <MenuItem key="3">Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem key="4">Separated link</MenuItem>
        </DropdownButton>
        <GoogleFirebaseTransitMap></GoogleFirebaseTransitMap>
      </div>
    );
  }
});

React.renderComponent(<Demo />, document.getElementById('content'));
