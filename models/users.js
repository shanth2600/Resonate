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
    coordinates: {type: [Number], index: '2dsphere'}
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
