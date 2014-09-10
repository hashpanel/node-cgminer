var REGEX = /^([\w-]+)(?:\|([^ ]+))?( \(\*\))?[\n\s]+(\w+)((?:.|\n)*)$/;

/**
 * Read the commands from the API readme and convert to JSON
 */
function getCommands () {
  var command, _i, _len,
    docs = require("fs").readFileSync("" + __dirname + "/commands.txt", "utf-8"),
    parsed = docs.split(/\n\n /g).map(function(command) {
      return command.match(REGEX);
    }),
    getDetails = function(l) {
      return l.replace(/^\s+/, "");
    },
    commands = {};
  for (_i = 0, _len = parsed.length; _i < _len; _i++) {
    command = parsed[_i];
    if (command != null) {
      commands[command[1]] = {
        name: command[1],
        args: command[2],
        privileged: !!command[3],
        reply: command[4] !== "none" ? command[4] : null,
        details: command[5].split("\n").map(getDetails).join("\n")
      };
    }
  }
  return commands;
}

module.exports = {
  getCommands: getCommands
};
