const Benchmark = require('benchmark');

const doSomeWork = () => Math.floor(Math.random() * 666 + 1);
const inc = (x) => x + 1;
const sampleCallback = inc;

function typical(cb) {
  const result = doSomeWork();
  if (cb) {
    cb(result);
  }
}

function optimized(cb) {
  const result = doSomeWork();
  cb(result);
}

const suite = new Benchmark.Suite("cb-null-check");
suite
  .add('typical', () => typical(sampleCallback))
  .add('optimized', () => optimized(sampleCallback))
  .on('start', (event) => console.log(`=== ${event.currentTarget.name}`))
  .on('cycle', (event) => console.log(String(event.target)))
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  });

module.exports = suite;
