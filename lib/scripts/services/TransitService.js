'use strict';

var Firebase = require('firebase');

var transitRef = new Firebase('https://publicdata-transit.firebaseio.com/');

/**
* Get the public transportation route vehicles
*/
function transitLine(line) {
  line = line || 'lametro-rail';
  return transitRef.child(line + '/vehicles');
}

/**
* When user selects new location we
* need to grab new firebase feed
*/
function updateTransitLine(line) {
  return transitRef.child(line + '/vehicles');
}

module.exports = {
  transitLine: transitLine
}
