var cgminer = require('./client'),
  client = new cgminer({ host: '127.0.0.1', port: 4028 });
  //client = new cgminer({ host: '701.tjwebb.info', port: 2540 });

console.log('making request...');

/*
client.gpumem(0, 1250).then(function (result) {
  console.log(result);
}).done();
*/

/*
client.gpu(0).then(function (result) {
  console.log(result);
}).done();
client.gpu(1).then(function (result) {
  console.log(result);
}).done();
client.gpu(2).then(function (result) {
  console.log(result);
}).done();
/*
client.pools().then(function (result) {
  console.log(result);
}).done();
*/
client.version().then(function (result) {
  console.log(result);
}).done();
/*
client.config().then(function (result) {
  console.log(result);
}).done();
*/
