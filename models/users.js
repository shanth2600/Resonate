var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  person_id: mongoose.Schema.Types.ObjectId,
  age: Number,
  name: String,
  gender: String,
  email: String,
  album_list: {},
  location: {
    type: [Number], index: '2dsphere'
  }

  /*latitude: Number,
  longitude: Number,
  albums:[
    {
      _id:Number,
      playcount:Number
    }
  ]*/
});

mongoose.model('users', usersSchema);

userSchema.statics.search = function(search, cb) {
  var here = this.find();

  if (search.location) {
    here.where('location').near({
      center: {
        type: 'Point',
        coordinates: search.loc
      },
      maxDistance: search.distance * 1000
    });
  }
  here.exec(cb);
};