# mongoose-prime

prime a mongoose model with data

### usage

```javascript
// mongoose is connection and `users` is already registered
var mp = require('mongoose-prime')
  , users = mongoose.model('users')
  , data = require('./data/users')
  ;

mp(users, data, function(err, results) {
    Object.keys(results).forEach(function(key) {
        console.log(results[key] + " user " + key);
    });
});
```


### api

#### `mp(model, data, [validate], [callback])`

 - `model` - reference to the mongoose model
 - `data` - an array of objects
 - `validate` - optional boolean to disable schema validation (default: `null`)
 - `callback` - optional `function(err, results) {}`

`callback` receives a `results` object of with three numbers: `added`, `failed`, `skipped` and a `records` array, containing the inserted records.

`validate` indicates whether schema validation should occur before inserting. For example, object reference validators which ensure the referenced document exists may prevent data from being loaded (i.e. cylical dependencies). To prevent this, invoke with the value of `false` to temporarily suspend the validators. After loading the data, the schema validation will be set to it's previous value. If no value is specified, `mongoose-prime` will not modify the model's validation settings. (cf. [`#validateBeforeSave`](http://mongoosejs.com/docs/guide.html#validateBeforeSave))

### integration

`mongoose-prime` plays nicely with [`mongoose-deleted`](https://www.npmjs.com/package/mongoose-deleted).
