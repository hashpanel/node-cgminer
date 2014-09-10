var assert = require('assert');
var _ = require('lodash');
var Client = require('./lib/client');

describe('cgminer-api', function () {

  describe('@parser', function () {

  });

  describe('@client', function () {
    var client;

    before(function (done) {
      client = new Client();
      client.load().then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('can double-load without error', function (done) {
      client.load().then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('#_commands', function () {
      assert(_.isObject(client._commands));
    });

    it('#version()', function (done) {
      assert(_.isFunction(client.version), 'client.version() is not a function');
      client.version().then(function (result) {
          assert(_.isObject(result));
          assert(_.isString(result.API));
          done();
        })
        .catch(done);
    });
    it('#summary()', function (done) {
      assert(_.isFunction(client.summary), 'client.summary() is not a function');
      client.summary().then(function (result) {
          assert(_.isObject(result));
          done();
        })
        .catch(done);
    });

  });

});
