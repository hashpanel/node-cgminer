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

    it('should query version', function (done) {
      client.version().then(function (result) {
          assert(_.isObject(result));
          assert(_.isString(result.API));
          done();
        })
        .catch(done);
    });

  });

});
