
var async = require('async')
  , _ = require('lodash')
  ;

module.exports = function(model, data, cb) {
    var skipped = 0, added = 0, failed = 0;
    async.each(data, function(data, cb) {

        var copy = {};
        _.chain(data).keys().each(function(key) {
            var type = typeof data[key];
            if (type == "object" || type == "function") return;
            copy[key] = data[key];
        });

        model.findOne(copy, function(err, results) {
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
