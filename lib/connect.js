/**
 * js generated from https://github.com/tlrobinson/node-cgminer. not sure 
 * why that guy was too lazy to convert his code to javascript before
 * submitting the cgminer npm module, but kudos to him nonetheless.
 */
var CGMinerClient, Q, command, device, name, net, _fn, _fn1, _i, _len, _ref, _ref1,
  __slice = [].slice;

net = require("net");
Q = require("bluebird");

CGMinerClient = (function() {
  function CGMinerClient(options) {
    if (options == null) {
      options = {};
    }
    this.host = options.host || "127.0.0.1";
    this.port = options.port || 4028;
  }

  CGMinerClient.prototype.request = function() {
    var args, command, deferred, socket;
    command = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    deferred = Q.defer();
    socket = net.connect({
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
          return deferred.resolve(JSON.parse(buffer.replace(/[^\}]+$/, "")));
        } catch (_error) {
          err = _error;
          return deferred.reject(err);
        }
      });
      return socket.write(JSON.stringify({
        command: command,
        parameter: args.join(",")
      }));
    });
    return deferred.promise;
  };

  CGMinerClient.prototype._version = function(r) {
    return r.VERSION[0];
  };

  CGMinerClient.prototype._devs = function(r) {
    return r.DEVS;
  };

  return CGMinerClient;

})();

_ref = ["pga", "gpu", "asc"];
_fn = function(device) {
  var deviceUC;
  deviceUC = device.toUpperCase();
  CGMinerClient.prototype["_" + device] = function(r) {
    return r["" + deviceUC][0];
  };
  return CGMinerClient.prototype["_" + device + "count"] = function(r) {
    return r["" + deviceUC + "S"][0].Count;
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  device = _ref[_i];
  _fn(device);
}

CGMinerClient.commands = require("./commands").getCommands();

_ref1 = CGMinerClient.commands;
_fn1 = function(name, command) {
  return CGMinerClient.prototype[name] = function() {
    var args,
      _this = this;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.request.apply(this, [name].concat(args)).then(function(result) {
      if (_this["_" + name] != null) {
        return Q["try"](function() {
          return _this["_" + name](result);
        });
      } else {
        return result;
      }
    });
  };
};
for (name in _ref1) {
  command = _ref1[name];
  _fn1(name, command);
}

module.exports = CGMinerClient;
