'use strict';

var Firebase = require('firebase')
//var routes = require('../../data/hubs.json');

var transitRef = new Firebase('https://publicdata-transit.firebaseio.com/')

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
