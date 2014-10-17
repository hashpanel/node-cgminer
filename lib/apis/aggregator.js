var Promise = require('bluebird');
var request = require('request');
var _ = require('lodash');
var semver = require('semver');
var util = require('util');
var parser = require('./parser');

/**
 * Return list of compatible cgminer tags that we want to build APIs for.
 */
function getCgminerTags () {
  var startVersion = '2.11.4';
  var url = 'https://api.github.com/repos/ckolivas/cgminer/git/refs/tags';

  return new Promise(function (resolve, reject) {
    request({ url: url, json: true }, function (error, response, body) {
      if (error) return reject(error);

      var tags = _.map(JSON.parse(body), function (tag) {
        return tag.ref.split('/')[2];
      });
      var compatibleVersions = _.filter(tags, function (tag) {
        return semver.gte(tag, startVersion);
      });

      resolve(compatibleVersions);
    });
  });
}

function sanitizeVersion (version) {
  var tokens = version.split('.');
  //console.log(_.first(tokens, 3).join('.'));
  return semver.clean(_.first(tokens, 3).join('.').split('_')[0]);
}

function getCgminerReadme (version) {
  var url = util.format(
    'https://raw.githubusercontent.com/hashware/cgminer/%s/API-README', 'v' +
    sanitizeVersion(version)
  );
  //console.log(url);

  return new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (error) return reject(error);

      //console.log(body);
      resolve(body);
    });
  });

}

exports.getCgminerReadme = getCgminerReadme;
