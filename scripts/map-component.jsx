/** @jsx React.DOM */
"use strict";

var React = require('react');
var ReactAddons = require('react/addons');
var ReactGoogleMaps = require('react-googlemaps');
var ReactFireMixin = require('reactfire');
var GoogleMapsAPI = window.google.maps;
var Map = ReactGoogleMaps.Map;
var LatLng = GoogleMapsAPI.LatLng;
var Marker = ReactGoogleMaps.Marker;

var TransitService = require('./services/TransitService');

var GoogleFirebaseTransitMap = React.createClass({

  mixins: [ReactFireMixin],

  /**
  * Set initial map position
  */
  getInitialState: function() {

    console.log(ReactAddons)

    return {
      center: new LatLng(34.052233999999999,-118.243685),
      zoom: 13,
      markers: {},
      buses: {}
    };
  },

  /**
  * Bind initial firebase markers to UI
  * TODO: see if these can moved
  */
  componentWillMount: function() {

    var transit = TransitService.transitLine();

    var that = this;

    transit.once("value", function (s) {
        s.forEach(function (b) {
          that.renderMarker(b.val(),b.name())
        });
    });

    transit.on("child_changed", function (s) {
        var busMarker = that.state.markers[s.name()];

        if (typeof busMarker === "undefined") {
            that.renderMarker(s.val(), s.name())
        } else {
            var id = s.name();
            var update = React.addons.update(that.state, {
              markers: { id: {$set: that.moveMarker(s.val().lat, s.val().lon, busMarker) }}});

            that.setState(update);

        }
    });

    transit.on("child_removed", function (s) {
        var busMarker = that.state.markers[s.name()];

        if (typeof busMarker !== "undefined") {
            //busMarker.setMap(null);
            delete TransitService.buses[s.name()];
        }
    });

    this.bindAsObject(transit, 'buses')
  },

  /**
  * Render the UI
  */
  render: function() {
    return (
      <Map
        map={this.props.map}
        initialZoom={this.state.zoom}
        initialCenter={this.state.center}
        width={700}
        height={700}>
        {this.state.markers}
      </Map>
      );
  },

  /**
  * Render a maps marker
  */
  renderMarker: function(bus, id) {
    this.state.markers[id] = <Marker position={new LatLng(bus.lat, bus.lon)} key={id} />;
  },

  /**
  * Move the marker when position updated
  * TODO: get this to work!
  */
  moveMarker: function(lat, lon, marker) {

    marker['props']['position']['B'] = lon;
    marker['props']['position']['k'] = lat;

    return marker;
  }

});

module.exports = GoogleFirebaseTransitMap;
