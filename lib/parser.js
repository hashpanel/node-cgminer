var REGEX = /^([\w-]+)(?:\|([^ ]+))?( \(\*\))?[\n\s]+(\w+)((?:.|\n)*)$/;

function getDetails (l) {
  return l.replace(/^\s+/, '');
}

/**
 * Read the commands from the API readme and convert to JSON
 */
function getCommands () {
  var docs = require('fs').readFileSync(__dirname + '/commands.txt', 'utf-8');
  var parsed = docs.split(/\n\n /g).map(function(command) {
    return command.match(REGEX);
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

exports.getCommands = getCommands;
