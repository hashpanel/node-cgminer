# cgminer-api

Complete cgminer API implementation for Node.js with multi-version support and integration tests

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## Install
```sh
$ npm install cgminer-api --save
```

## Usage
```
var Client = require('./lib/client');
var client = new Client();
client.load().then(function (client) {

  client.version().then(function (version) {
    console.log(version);
  });

});
```

## License
MIT

[sails-logo]: http://cdn.tjw.io/images/sails-logo.png
[sails-url]: https://sailsjs.org
[npm-image]: https://img.shields.io/npm/v/cgminer-api.svg?style=flat
[npm-url]: https://npmjs.org/package/cgminer-api
[travis-image]: https://img.shields.io/travis/tjwebb/cgminer-api.svg?style=flat
[travis-url]: https://travis-ci.org/tjwebb/cgminer-api
[daviddm-image]: http://img.shields.io/david/tjwebb/cgminer-api.svg?style=flat
[daviddm-url]: https://david-dm.org/tjwebb/cgminer-api
