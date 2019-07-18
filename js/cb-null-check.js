// Scenario: You are writing a library that allows users to specify a callback.
// This callback runs during a performance-critical section of your code,
// perhaps during an animation targeting 60fps.

const Benchmark = require('benchmark');

// Utility fns for simulating work.
const doSomeWork = () => Math.floor(Math.random() * 666 + 1);
const inc = (x) => x + 1;
const sampleCallback = inc;

// The typical approach to dealing with nullable callbacks is to
// perform a null check right before applying the callback.
function typical(cb) {
  const result = doSomeWork();
  if (cb) {
    cb(result);
  }
}

// I wondered: what performance impact do these null checks have for
// performance-critical regions, e.g. animation callbacks? It is common that
// the callback is added once and never removed, so it should be possible to
// remove the null check for the most likely path. Does this help at all?
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
