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
var Store = require('../store/store.jsx');

var store = new Store();

var GoogleFirebaseTransitMap = React.createClass({

  mixins: [ReactFireMixin],

  propTypes: {
    center: React.PropTypes.object,
    id: React.PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    return {
      // no default props yet...
    }
  },

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

    var newMarker = {}
    newMarker[marker.name()] = <Marker position={new LatLng(marker.val().lat, marker.val().lon)} key={marker.name()} /> ;

    var update = React.addons.update(this.state, {
      markers: { $merge: newMarker }
    });

    this.setState(update);

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
            this._animatedMoveTo(s.name(), s.val().lat, s.val().lon, this.state.markers[s.name()].props.position)
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
  },

  _feq: function(f1, f2) {
      return (Math.abs(f1 - f2) < 0.000001);
  },

  _animatedMoveTo: function (id, toLat, toLng, startPos) {
    var fromLat, fromLng, frames = [], percent, curLat, curLng, move;

    fromLat = startPos.k;
    fromLng = startPos.B;

    if (this._feq(fromLat, toLat) && this._feq(fromLng, toLng)) {
        return;
    }

    for (percent = 0; percent < 1; percent += 0.015) {
        curLat = fromLat + percent * (toLat - fromLat);
        curLng = fromLng + percent * (toLng - fromLng);
        frames.push(new LatLng(toLat, toLng));
    }

    move = function (that, latlngs, index, wait) {

        var marker = {}
        marker[id] = <Marker position={latlngs[index]} key={id} /> ;

        var update = React.addons.update(that.state, {
          markers: { $merge: marker }
        });

        that.setState(update);

        if (index !== latlngs.length - 1) {
            setTimeout(function () {
                move(that, latlngs, index + 1, wait);
            }, wait);
        }
    };
    move(this, frames, 0, 45);
  }

});

module.exports = GoogleFirebaseTransitMap;
