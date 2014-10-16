var assert = require('assert');
var _ = require('lodash');
var Client = require('./lib/client');

describe('cgminer-api', function () {

  describe('@parser', function () {

  });

  describe('@client', function () {
    var client;

    before(function (done) {
      client = new Client({
        host: process.env.CGMINER_HOST,
        port: process.env.CGMINER_PORT
      });
      client.connect()
        .then(function (client) {
          assert(client instanceof Client);
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('can double-connect without error', function (done) {
      client.connect()
        .then(function (client) {
          assert(client instanceof Client);
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    describe('#_commands', function () {
      it('should be an object', function () {
        //console.log(client._commands);
        assert(_.isObject(client._commands));
      });
    });

    describe('#version()', function (done) {
      it('should return a validated object', function (done) {
        assert(_.isFunction(client.version), 'client.version() is not a function');
        client.version().then(function (result) {
            assert(_.isObject(result));
            assert(_.isString(result.API));
            done();
          })
          .catch(done);
        });
    });

    describe.skip('#stats()', function (done) {
      it('should return a validated object', function (done) {
        assert(_.isFunction(client.stats), 'client.stats() is not a function');
        client.stats().then(function (stats) {
            assert(_.isObject(stats));
            done();
          })
          .catch(done);
      });
    });

    describe('#summary()', function (done) {
      it('should return a validated object', function (done) {
        assert(_.isFunction(client.summary), 'client.summary() is not a function');
        client.summary().then(function (summary) {
            assert(_.isObject(summary));
            done();
          })
          .catch(done);
      });
    });

    describe('#pools()', function (done) {
      it('should return a validated object', function (done) {
        assert(_.isFunction(client.summary), 'client.pools() is not a function');
        client.pools().then(function (pools) {
            //console.log(pools);
            assert(_.isArray(pools));
            done();
          })
          .catch(done);
      });
    });

    describe('#devs()', function (done) {
      it('should return a validated object', function (done) {
        assert(_.isFunction(client.summary), 'client.devs() is not a function');
        client.devs().then(function (devices) {
            console.log(devices);
            assert(_.isArray(devices));
            done();
          })
          .catch(done);
      });
    });
    describe('#config()', function (done) {
      it('should return a validated object', function (done) {
        assert(_.isFunction(client.summary), 'client.config() is not a function');
        client.config().then(function (config) {
            assert(_.isObject(config));
            done();
          })
          .catch(done);
      });
    });
    describe('#addpool()', function (done) {
      var poolCount = 0;
      before(function (done) {
        client.pools().then(function (pools) {
            assert(_.isArray(pools));
            poolCount = pools.length;
            done();
          })
          .catch(done);
      });
      it('should return a validated object', function (done) {
        var pool = [
          'stratum+tcp://us1.ghash.io:3333',
          'abshnasko.ephemeral1',
          'x'
        ];
        assert(_.isFunction(client.addpool), 'client.addpool() is not a function');
        client.addpool(pool).then(function (status) {
            console.log(status);
            assert(_.isObject(status));
            assert(/added pool/i.test(status.Msg));
            done();
          })
          .catch(done);
      });
      it('should add a pool', function (done) {
        client.pools().then(function (pools) {
            assert(_.isArray(pools));
            assert(pools.length === poolCount + 1,
              'pool count should be ' + (poolCount + 1) + ' but is actually '+ pools.length);
            done();
          })
          .catch(done);
      });
    });
    describe('#enablepool()', function (done) {
      it('should return a validated object', function (done) {
        client.enablepool(0).then(function (status) {
            assert(_.isObject(status));
            done();
          })
          .catch(done);
      });
      it('should enable pool', function (done) {
        client.enablepool(0).then(function (status) {
            //console.log(status);
            assert(/already enabled/.test(status.Msg), status.Msg);
            done();
          })
          .catch(done);
      });
    });
    describe('#disablepool()', function (done) {
      it('should return a validated object', function (done) {
        client.disablepool(0)
          .then(function (status) {
            assert(/Disabling pool/.test(status.Msg), status.Msg);
            assert(_.isObject(status));
            done();
          })
          .catch(done);
      });
      it('should disable pool', function (done) {
        client.disablepool(0)
          .then(function (status) {
            assert(/already disabled/.test(status.Msg), status.Msg);
            done();
          })
          .catch(done);
      });
    });
    describe('#removepool()', function (done) {
      it('should disable and remove pool', function (done) {
        client.removepool(0)
          .then(function (status) {
            //console.log(status);
            if (/Cannot remove active pool/.test(status.Msg)) {
              // should throw a warning here, but this is not an exception
              return client.disablepool(0);
            }
            else {
              assert(/Removed pool 0/.test(status.Msg), status.Msg);
            }
          })
          .then(function (status) {
            //console.log(status);
            done();
          })
          .catch(done);
      });
    });
    describe('#switchpool()', function (done) {
      it('should switch pool 0 to highest priority', function (done) {
        client.switchpool(0)
          .then(function (status) {
            assert(_.isObject(status));
            assert(_.any([
                /Switching to pool 0/.test(status.Msg),
                /Cannot remove active pool/.test(status.Msg)
              ]), status.Msg
            );
            done();
          })
          .catch(done);
      });
    });
    describe('#save()', function (done) {
      it('should save config without error', function (done) {
        client.save()
          .then(function (status) {
            assert(/Configuration saved to file/.test(status.Msg));
            assert(_.isObject(status));
            done();
          })
          .catch(done);
      });
    });
    describe('#privileged()', function (done) {
      it('should return success, indicating we have privileged access', function (done) {
        client.privileged()
          .then(function (status) {
            assert(/Privileged access OK/.test(status.Msg));
            assert(_.isObject(status));
            done();
          })
          .catch(done);
      });
    });
    describe('#check()', function (done) {
      it('should check summary command', function (done) {
        client.check('summary')
          .then(function (cmd) {
            assert(_.isObject(cmd));
            assert(cmd.Exists === 'Y');
            assert(cmd.Access === 'Y');
            done();
          })
          .catch(done);
      });
      it('should check bogus command', function (done) {
        client.check('bogus')
          .then(function (cmd) {
            assert(_.isObject(cmd));
            assert(cmd.Exists === 'N');
            assert(cmd.Access === 'N');
            done();
          })
          .catch(done);
      });
    });

    describe('#restart()', function (done) {
      it('should restart', function (done) {
        client.restart()
          .then(function (status) {
            assert(_.isObject(status));
            done();
          })
          .catch(done);
      });
    });
  });
});
