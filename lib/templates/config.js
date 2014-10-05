var _ = require('lodash');

module.exports = {
 'GPU Count': _.isNumber,
 'ASC Count': _.isNumber,
 'PGA Count': _.isNumber,
 'CPU Count': _.isNumber,
 'Pool Count': _.isNumber,
 ADL: _.isString,
 'ADL in use': _.isString,
 Strategy: _.isString,
 'Log Interval': _.isNumber,
 'Device Code': _.isString,
 OS: _.isString,
 'Failover-Only': _.isBoolean,
 ScanTime: _.isNumber,
 Queue: _.isNumber,
 Expiry: _.isNumber,
 Hotplug: _.isString
};

/**
 * { 'GPU Count': 0,
    'ASC Count': 0,
    'PGA Count': 0,
    'CPU Count': 1,
    'Pool Count': 1,
    ADL: 'N',
    'ADL in use': 'N',
    Strategy: 'Failover',
    'Log Interval': 5,
    'Device Code': 'CPU ',
    OS: 'Linux',
    'Failover-Only': false,
    ScanTime: 60,
    Queue: 1,
    Expiry: 120,
    Hotplug: 'None' }
*/
