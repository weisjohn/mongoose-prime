# mongoose-prime

Prime a mongoose model with default data.


### usage

`mongoose-prime` takes a mongoose `model`, an array of `objects`, and an err-first `callback`:

```
// assuming a mongoose connection and model defined elsewhere
var Templates = mongoose.model('Templates');

// mongoose-prime integration
var mp = require('mongoose-prime')
  , data = require('./data/templates')
  ;

mp(Templates, data, function(err, results) {
    Object.getOwnPropertyNames(results).forEach(function(key) {
        if (results[key]) console.log(results[key] + " default template " + key);
    });
});
```

The callback receives a `results` object of with three numbers: `added`, `failed`, `skipped` and a `records` array, containing the inserted records.