var _ = require('lodash');

module.exports = {
  STATUS: _.isString,
  When: _.isNumber,
  Code: _.isNumber,
  Msg: _.isString,
  Description: _.isString
};

/**
{ STATUS: 'S',
  When: 1412896815,
  Code: 55,
  Msg: 'Added pool \'us1.ghash.io:3333\'',
  Description: 'cgminer 2.11.4' }

 */
