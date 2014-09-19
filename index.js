
var async = require('async')
  , _ = require('lodash')
  ;

module.exports = function(model, data, cb) {
    var skipped = 0, added = 0, failed = 0, records = [];
    async.each(data, function(data, cb) {

        var query = {};
        if (data._id) {
            query = { _id : data._id };
        } else {
            _.chain(data).keys().each(function(key) {
                var type = typeof data[key];
                if (type == "object" || type == "function") return;
                query[key] = data[key];
            });
        }

        model.findOne(query, function(err, result) {
            if (err) return cb(err);
            if (result) { skipped++; return cb(); }
            (new model(data)).save(function(err, result) {
                if (err) failed++;
                if (result) { added++; records.push(result); }
                cb();
            });
        });

    }, function(err) {
        cb(err, { 
            skipped: skipped, 
            added: added, 
            failed: failed, 
            records: records 
        });
    });
}
