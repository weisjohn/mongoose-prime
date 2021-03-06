var mongoose = require('mongoose');

module.exports = function(cb) {

    mongoose.model('people', (new mongoose.Schema({
        first_name: String,
        last_name: String,
        birthday: Date
    })), 'people');

    mongoose.model('site', (new mongoose.Schema({
        url: String,
        last_visit: {
            type: Date,
            default: Date.now
        }
    })));

    cb();
}
