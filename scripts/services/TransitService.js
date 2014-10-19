'use strict';

var Firebase = require('firebase');

var transitRef = new Firebase('https://publicdata-transit.firebaseio.com/');

/**
* Get the public transportation route vehicles
*/
function transitLine(line) {
  line = line || 'rutgers';
  return transitRef.child(line + '/vehicles');
}

module.exports = {
  transitLine: transitLine
}
