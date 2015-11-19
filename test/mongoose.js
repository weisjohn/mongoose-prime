
// create a connection
var mongoose = require('mongoose');
module.exports = function(cb) {

    mongoose.connect('mongodb://localhost/mongoose-prime-test');

    mongoose.connection.on('open', function() {
        require('./models')(cb);
    });

}
