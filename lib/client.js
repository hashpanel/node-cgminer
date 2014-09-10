var _ = require('lodash');
var net = require("net");
var Promise = require("bluebird");
var templates = require('./templates');
_.mixin(require('congruence'));
/**
 * js generated from https://github.com/tlrobinson/node-cgminer. not sure 
 * why that guy was too lazy to convert his code to javascript before
 * submitting the cgminer npm module, but kudos to him nonetheless.
 */
var CGMinerClient, Promise, command, device, name, net, _fn, _i, _len,
  __slice = [].slice;


function createDeviceMethod (device) {
  var deviceUC = device.toUpperCase();

  this["_" + device] = function(r) {
    return r["" + deviceUC][0];
  }.bind(this);

  this["_" + device + "count"] = function(r) {
    return r["" + deviceUC + "S"][0].Count;
  }.bind(this);
}

function createCommandMethod (command) {
  this[command.name] = function (args) {
    return this.request(command, args || [ ])
      .then(function (result) {
        if (_.isFunction(this["_" + name])) {
          return Promise.try(function () {
            return this["_" + name](result);
          }.bind(this));
        }
        else {
          return result;
        }
    }.bind(this));
  }.bind(this);
}

/**
 * @constructor
 */
function CGMinerClient(options) {
  if (!_.isObject(options)) {
    options = {};
  }
  this.host = options.host || "127.0.0.1";
  this.port = options.port || 4028;
  createCommandMethod.bind(this)({ name: 'version', reply: 'VERSION' });
}

/**
 * Load the commands for the API version of the miner we are connected to.
 */
CGMinerClient.prototype.load = function () {
  if (this._loaded) return Promise.resolve();
  this._loaded = true;

  return this.version().then(function (version) {
      this._commands = require("./parser").parse(version.API);
      this._types = ["pga", "gpu", "asc"];

      _.each(this._commands, createCommandMethod.bind(this));
      _.each(this._types, createDeviceMethod.bind(this));

    }.bind(this));
};

/**
  * { STATUS: 
  *  [ { STATUS: 'E',
  *      When: 1410364655,
  *      Code: 14,
  *      Msg: 'Invalid command',
  *      Description: 'cgminer 2.11.0' } ],
  *  id: 1 }
  */

CGMinerClient.prototype.request = function (command, args) {
  var deferred = Promise.defer();
  var socket = net.connect({
    host: this.host,
    port: this.port
  });
  socket.on("error", function(err) {
    return deferred.reject(err);
  });
  socket.on("connect", function() {
    var buffer;
    buffer = "";
    socket.on("data", function(data) {
      return buffer += data.toString();
    });
    socket.on("end", function() {
      var err;
      try {
        var json = JSON.parse(buffer.replace(/[^\}]+$/, ""));
        if (json.STATUS[0].STATUS === 'E') {
          return deferred.reject(json.STATUS[0]);
        }
        if (!_.similar(templates[command.name], json[command.reply][0])) {
          return deferred.reject({ msg: 'response did not match template', response: json });
        }
        return deferred.resolve(json[command.reply][0]);
      } catch (_error) {
        err = _error;
        return deferred.reject(err);
      }
    });
    return socket.write(JSON.stringify({
      command: command.name,
      parameter: args.join(",")
    }));
  });
  return deferred.promise;
};

module.exports = CGMinerClient;
