var _ = require('lodash');
var net = require('net');
var Promise = require('bluebird');
var templates = require('./templates');
_.mixin(require('congruence'));

var singular = [
  'VERSION',
  'SUMMARY',
  'CHECK'
];
var replyMapping = {
  check: 'CHECK'
};
function createDeviceMethod (device) {
  var deviceUC = device.toUpperCase();

  this['_' + device] = function (r) {
    return r['' + deviceUC][0];
  }.bind(this);

  this['_' + device + 'count'] = function (r) {
    return r['' + deviceUC + 'S'][0].Count;
  }.bind(this);
}

function createCommandMethod (command) {
  this[command.name] = function (args) {
    return this.request(command, args)
      .then(function (result) {
        if (_.isFunction(this['_' + command.name])) {
          return Promise.try(function () {
            return this['_' + name](result);
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
  this.host = options.host || '127.0.0.1';
  this.port = options.port || 4028;
  createCommandMethod.bind(this)({ name: 'version', reply: 'VERSION' });
}

/**
 * Load the commands for the API version of the miner we are connected to.
 */
CGMinerClient.prototype.connect = function () {
  if (this._loaded) return Promise.resolve(this);
  this._loaded = true;

  return this.version()
    .then(function (version) {
      return require('./apis/parser').parse(version.CGMiner);
    })
    .then(function (commands) {
      //console.log(commands);
      this._commands = commands;
      this._types = ['pga', 'gpu', 'asc'];

      _.each(this._commands, createCommandMethod.bind(this));
      _.each(this._types, createDeviceMethod.bind(this));
    }.bind(this))
    .return(this);

};

/**
 * Send a requret to cgminer
 * @param command.name
 * @param command.reply
 * @param args
 */
CGMinerClient.prototype.request = function (command, args) {
  if (_.has(replyMapping, command.name)) {
    command.reply = replyMapping[command.name];
  }
  var deferred = Promise.defer();
  var socket = net.connect({
    host: this.host,
    port: this.port
  });
  socket.on('error', function (err) {
    return deferred.reject(err);
  });
  socket.on('connect', function () {
    var buffer = '';
    socket.on('data', function (data) {
      buffer += data.toString();
    });
    socket.on('end', function () {
      var json;
      // XXX workaround for https://bitcointalk.org/index.php?topic=28402.msg9170949#msg9170949
      var str = buffer
        .replace(/\-nan/g, '0')
        .replace(/[^\x00-\x7F]/g, '');
      try {
        if (/RESTART/.test(str)) {
          json = {
            STATUS: [{
              STATUS: 'S',
              Code: -1,
              Msg: 'Restart',
              Description: 'Restarting now',
              When: (new Date()).valueOf()
            }]
          };
        }
        else {
          console.log(str);
          json = JSON.parse(str.replace(/[^\}]+$/, ''));
        }
        //console.log(command);
        //console.log(command.reply);
        //console.log(json);
        if (command.reply === null) {
          if (_.similar(templates['null'], json.STATUS[0])) {
            return deferred.resolve(json.STATUS[0]);
          }
          else {
            return deferred.reject({ msg: 'response did not match template', response: json });
          }
        }
        if (json.STATUS[0].STATUS === 'E') {
          return deferred.reject(new Error(json.STATUS[0].Msg));
        }
        _.each(json[command.reply], function (reply) {
          if (!_.similar(templates[command.name], json[command.reply])) {
            return deferred.reject({ msg: 'response did not match template', response: json });
          }
        });
        if (_.contains(singular, command.reply)) {
          return deferred.resolve(json[command.reply][0]);
        }
        else {
         return deferred.resolve(json[command.reply]);
        }
      }
      catch (e) {
        return deferred.reject(e);
      }
    });
    return socket.write(JSON.stringify({
      command: command.name,
      parameter: _.isArray(args) ? args.join(',') : args
    }));
  });
  return deferred.promise;
};

module.exports = CGMinerClient;
