
var async = require('async');

module.exports = function(model, data, cb) {
    var skipped = 0, added = 0, failed = 0;
    async.each(data, function(data, cb) {
        model.findOne(data, function(err, results) {
            if (err) return cb(err);
            if (results) { skipped++; return cb(); }
            (new model(data)).save(function(err, results) {
                if (err) failed++;
                if (results) added++;
                cb();
            });
        });
    }, function(err) {
        cb(err, { skipped: skipped, added: added, failed: failed });
    });
}
