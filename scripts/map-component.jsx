/** @jsx React.DOM */
"use strict";

var React = require('react');
var ReactGoogleMaps = require('react-googlemaps');
var ReactFireMixin = require('reactfire')
var GoogleMapsAPI = window.google.maps;
var Map = ReactGoogleMaps.Map;
var LatLng = GoogleMapsAPI.LatLng;
var Marker = ReactGoogleMaps.Marker;

var TransitService = require('./services/TransitService')

var GoogleFirebaseTransit = React.createClass({

  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      center: new LatLng(40.5227578,-74.4396854),
      zoom: 13,
      markers: [
        { position: new LatLng(40.522, -74.43) }
      ],
      buses: {}
    };
  },

  componentWillMount: function() {

    var transit = TransitService.transitLine();

    var _this = this;

    transit.once("value", function (s) {
        s.forEach(function (b) {
          _this.state.markers = TransitService.addBuses(b);
        });
    });

    transit.on("child_changed", function (s) {
        var busMarker = TransitService.buses[s.name()];
        if (typeof busMarker === "undefined") {
            TransitService.newBus(s.val(), s.name());
        }
    });

    transit.on("child_removed", function (s) {
        var busMarker = TransitService.buses[s.name()];
        if (typeof busMarker !== "undefined") {
            busMarker.setMap(null);
            delete TransitService.buses[s.name()];
        }
    });

    this.bindAsObject(transit, 'buses')
  },

  render: function() {
    return (
      <Map
        initialZoom={this.state.zoom}
        initialCenter={this.state.center}
        width={700}
        height={700}>
        {this.state.markers.map(this.renderMarkers)}
      </Map>
      );
  },

  renderMarkers: function(state, i) {
    return (<Marker position={state.position} key={i} />);
  }

});

module.exports = GoogleFirebaseTransit;
