var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var COMMAND_REGEX = /^([\w-]+)(?:\|([^ ]+))?( \(\*\))?[\n\s]+(\w+)((?:.|\n)*)$/;

function getDetails (l) {
  return l.replace(/^\s+/, '');
}

/**
 * Parse the commands from the API readme and convert to JSON
 * <https://github.com/ckolivas/cgminer/blob/master/API-README>
 */
function parse (version) {
  var filename = 'api-' + version + '.txt';
  var docs = fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');
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
}

exports.versions = [
  '1.24'
];
exports.parse = parse;
