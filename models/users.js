var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  person_id: mongoose.Schema.Types.ObjectId,
  age: Number,
  name: String,
  gender: String,
  email: String,
  album_list: [Number],
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


usersSchema.methods.search = function(search, cb) {
  var here = this.find();

  if (search.location) {
    here.where('location').near({
      center: {
        type: 'Point',
        coordinates: search.location
      },
      maxDistance: search.distance * 1000
    });
  }
  here.exec(cb);
};

var users = mongoose.model('users', usersSchema);

var test_user = users({
  age: 20,
  name: 'Johnny Longjohnny_7',
  gender: 'Undefined',
  email: 'Longjohnny@gmail.com',
  /*
   album_list: {
   1 : 'here i am',
   3 : 'there i am'
   },
   */
  album_list: [5,7,1,2,0],
  location:  [-118.4967633,34.2622889]

});

var test_user2 = users({
  age: 20,
  name: 'Johnny Longjohnny_8',
  gender: 'Undefined',
  email: 'Longjohnny2@gmail.com',
  /*
   album_list: {
   1 : 'here i am',
   3 : 'there i am'
   },
  */
  album_list: [5,7,1,2,0],
  location: [-118.527703,6,34.2379572],

});
test_user.search({}, function(err,items){
      console.log(items);
    }

);
/*
test_user2.save(function (err, test_user){
  if (err) return console.error(err);
  console.log("test_user saved!");
});

test_user2.save(function (err, test_user){
  if (err) return console.error(err);
  console.log("test_user2 saved!");
});
*/

