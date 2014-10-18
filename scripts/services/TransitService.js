'use strict';

var Firebase = require('firebase')
var routes = require('../../data/hubs.json');

var transitRef = new Firebase('https://publicdata-transit.firebaseio.com/')
var buses = {}

function transitLine(line) {
  line = line || 'rutgers';
  return transitRef.child('rutgers');
}

function addBuses(collection) {

  var buses = collection.val() || {};
  var id = collection.name() || "";
  var newBuses = []

  for(var bus in buses) {
    if(_isBus(buses[bus])) { // TODO: for some reason firebase is returning two objects, need to find out why
      newBuses.push(newBus(buses[bus], id));
    }
  }

  return newBuses;
}

function _isBus(bus) {
  if(bus.routeTag) return true;
  return false;
}

function newBus(bus, firebaseId) {
    var busLatLng, tag, marker;
    busLatLng = new google.maps.LatLng(bus.lat, bus.lon);
    tag = bus.routeTag.toString()[0].toUpperCase() + bus.routeTag.toString().slice(1);
    marker = new google.maps.Marker({
        icon: "http://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bbT|" + tag + "|7094FF|eee",
        position: busLatLng
    });
    buses[firebaseId] = marker;
    return marker;
}

module.exports = {
  transitLine: transitLine,
  newBus: newBus,
  buses: buses,
  addBuses: addBuses
}
