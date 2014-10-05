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
        host: '54.165.235.198',
        port: 4028
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
            //console.log(devices);
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
            //console.log(config);
            assert(_.isObject(config));
            done();
          })
          .catch(done);
      });
    });
  });
});
