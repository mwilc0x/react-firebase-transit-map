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

    return {
      zoom: 13,
      markers: {},
      buses: {},
      center: new LatLng(34.052233999999999,-118.243685)
    };
  },

  /**
  * Initial default props
  */
  getDefaultProps: function(){

  },

  /**
  * Get notified when parent props have updated
  */
  componentWillReceiveProps: function(props) {

    this.setState({
      center: props.center
    });

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
            var id = s.name();
            var update = React.addons.update(this.state, {
              markers: { id: {$set: this.moveMarker(s.val().lat, s.val().lon, busMarker) }}});

            this.setState(update);
        }
    }, this);

    stream.on("child_removed", function (s) {
        var busMarker = this.state.markers[s.name()];

        if (typeof busMarker !== "undefined") {
            //busMarker.setMap(null);
            delete this.state.markers[s.name()];
        }
    }, this);
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
