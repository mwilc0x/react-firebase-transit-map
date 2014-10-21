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

var TransitService = require('../services/TransitService');

var GoogleFirebaseTransitMap = React.createClass({

  mixins: [ReactFireMixin],

  /**
  * Set initial map position
  */
  getInitialState: function() {

    return {
      zoom: 13,
      markers: {},
      center: new LatLng(34.052233999999999,-118.243685)
    };
  },

  /**
  * Get notified when parent props have updated
  */
  componentWillReceiveProps: function(props) {

    this.setState({
      center: props.center
    });

    // location has changed so we have to erase
    // old markers and load in new ones
    this._removeOldMarkers();
    this._bindFirebaseEvents(TransitService.updateTransitLine(props.id));

  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  },

  /**
  * Bind initial firebase markers to UI
  * TODO: see if these can moved
  */
  componentWillMount: function() {

    this._bindFirebaseEvents(TransitService.transitLine())

    this.bindAsObject(TransitService.transitLine(), 'buses')
  },

  /**
  * Render the UI
  */
  render: function() {
    return (
      <Map
        map={this.props.map}
        initialZoom={this.state.zoom}
        center={this.state.center}
        width={700}
        height={700}>
        {this.state.markers}
      </Map>
      );
  },

  /**
  * Render a maps marker
  */
  _renderMarker: function(marker) {
    if(!marker.name) return;
    this.state.markers[marker.name()] = <Marker position={new LatLng(marker.val().lat, marker.val().lon)} key={marker.name()} />;
  },

  _bindFirebaseEvents: function(stream) {
    stream.once("value", function (s) {
        s.forEach(this._renderMarker);
    }, this);

    stream.on("child_changed", function (s) {

        var busMarker = this.state.markers[s.name()];

        if (typeof busMarker === "undefined") {
            this._renderMarker(s.val(), s.name())
        } else {
            this.state.markers[s.name()].props.position = new LatLng(s.val().lat, s.val().lon);
        }
    }, this);

    stream.on("child_removed", function (s) {
        var busMarker = this.state.markers[s.name()];

        if (typeof busMarker !== "undefined") {
            delete this.state.markers[s.name()];
        }
    }, this);
  },

  _removeOldMarkers: function() {
    for(var key in this.state.markers) {
      delete this.state.markers[key];
    }
  }

});

module.exports = GoogleFirebaseTransitMap;
