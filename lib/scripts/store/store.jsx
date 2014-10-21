var EventEmitter = require("events").EventEmitter,
    util = require("util");

function Store() {
  EventEmitter.call(this);
  this.center = {};
}

util.inherits(Store, EventEmitter);

Store.prototype.update = function(center) {
  this.center = center;
  this.emit("change");
};

module.exports = Store;
