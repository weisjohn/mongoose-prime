var assert = require('assert');
var async = require('async');
var mongoose = require('mongoose');
var mp = require('../');

var people = [{
    "first_name": "Michael",
    "last_name": "Scott"
}, {
    "first_name": "Dwight",
    "last_name": "Schrute"
}];

function test(cb) {

    // obtain model refs
    var People = mongoose.model('people');
    assert.equal(People.modelName, 'people');

    async.series([
        function(cb) {
            mp(People, people, function(err, results) {

                // api level tests
                assert(!err, 'err should be null');
                assert(!!results, 'results should not be null');
                assert(typeof results === 'object', 'results should be an object');

                // return values
                assert.equal(results.skipped, 0);
                assert.equal(results.added, 2);
                assert.equal(results.failed, 0);
                assert.equal(results.records.length, 2);

                cb(null, 'done');
            });
        }, function(cb) {
            People.remove({}, cb);
        }
    ], cb);

}


// connect and run
require('./mongoose')(function() {
    test(function() {
        // don't bolt if inside node-dev
        if (!/node-dev$/.test(process.env._))
            process.exit(0);
    });
});
