var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var aggregator = require('./aggregator');

var COMMAND_REGEX = /^([\w-]+)(?:\|([^ ]+))?( \(\*\))?[\n\s]+(\w+)((?:.|\n)*)$/;

function getDetails (l) {
  return l.replace(/^\s+/, '');
}

/**
 * Parse the commands from the API readme and convert to JSON
 * <https://github.com/ckolivas/cgminer/blob/master/API-README>
 */
function parse (version) {
  return aggregator.getCgminerReadme(version)
    .then(function (readme) {
      var docs = getApiSection(readme);
      var parsed = docs.split(/\n\n /g).map(function(command) {
        return command.match(COMMAND_REGEX);
      });
      var commands = _.map(_.compact(parsed), function (command) {
        return {
          name: command[1],
          args: command[2],
          privileged: !!command[3],
          reply: command[4] !== 'none' ? command[4] : null,
          details: command[5].split('\n').map(getDetails).join('\n')
        };
      });

      return _.indexBy(commands, 'name');
    });
}

function getApiSection (readme) {
  var header = 'Request Reply Section Details'.replace(/\s/g, '');
  var lines = readme.split('\n');

  var headerIndex = _.findIndex(lines, function (line) {
    return header === line.replace(/\s/g, '');
  });
  var footerIndex = headerIndex + _.findIndex(_.rest(lines, headerIndex), function (line) {
    return /^When you enable/.test(line);
    //return !COMMAND_REGEX.test(line);
  });

  //console.log('headerIndex', headerIndex);
  //console.log('footerIndex', footerIndex);

  return [ '', '' ].concat(lines.slice(headerIndex, footerIndex)).join('\n');
}

exports.parse = parse;
