
var async = require('async')
  , _ = require('lodash')
  , EJSON = require('mongodb-extended-json')
  ;

module.exports = function(model, data, validate, cb) {

    // check if data is Array, wrap
    if (!Array.isArray(data)) {
        data = [data];
    }

    // optional validate
    if (typeof validate === "function") {
        cb = validate;
        validate = null;
    }

    // optional callback
    if (typeof cb !== "function") cb = function() {};

    // capture the original validation status
    var original = model.schema.options.validateBeforeSave;

    // only modify the setting if need be
    if (validate !== null)
        model.schema.set('validateBeforeSave', validate);

    var res = { skipped : 0, added : 0, failed : 0, records : [] };
    async.each(data, function(data, cb) {
        var query = {};
        if (data._id) {

            if (typeof data._id === 'object' && data._id.$oid)
                data = EJSON.deflate(data);

            query = { _id : data._id, $or : [
                { deleted : { $exists : true } },
                { deleted : { $exists : false } }
            ] };
        } else {
            // look for the exact same document
            _.chain(data).keys().each(function(key) {
                var type = typeof data[key];
                if (type === "object" || type === "function") return;
                query[key] = data[key];
            });
        }

        model.findOne(query, function(err, result) {
            if (err) { res.failed++; return cb(err); }
            if (result) { res.skipped++; return cb(); }
            (new model(data)).save(function(err, result) {
                if (err) res.failed++;
                if (result) { res.added++; res.records.push(result); }
                cb(err);
            });
        });

    }, function(err) {

        // set back to original if we've modified it
        if (validate !== null)
            model.schema.set('validateBeforeSave', original);

        cb(err, res);
    });
}
