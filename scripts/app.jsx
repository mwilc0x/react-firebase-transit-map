/** @jsx React.DOM */

'use strict';

var React = require('react');
window.React = React;

var GoogleFirebaseTransit = require('./map-component.jsx');

React.renderComponent(<GoogleFirebaseTransit />, document.getElementById('content'));
