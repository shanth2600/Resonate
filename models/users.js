var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 var usersSchema = new Schema({
 name: String
 });

 mongoose.model('users', usersSchema);
 */

var personSchema = new mongoose.Schema({
    person_id: mongoose.Schema.Types.ObjectId,
    age: Number,
    name: String,
    gender: String,
    email: String,
    profile_image: String,
    //album_list: [number],
    album_list: {},
    location: {
        type: [Number], index: '2dsphere'
    }
    //album has albumid and playcount
    /*
     album:[
     { album_id: mongoose.Schema.Types.ObjectId,
     playcount: Int
     }

     ],
     */
});

var User = mongoose.model('users', personSchema);

var park = new User(
    {
        name: "Park",
        location: [-118.4967633, 34.2622889]
    }
);

var csun = new User(
    {
        name: "CSUN",
        location: [-118.527178, 34.242349]
    }
);

var chilis = new User(
    {
        name: "Chilis",
        location: [-118.5389515, 34.2376345]
    }
);

var bangkok = new User(
    {
        name: "bangkok",
        location: [100.3529104, 13.7251097]
    }
);


var test_user = User({
    age: 20,
    name: 'Johnny Longjohnny_10',
    gender: 'Undefined',
    email: 'Longjohnny@gmail.com',

    /*
     album_list: {
     1 : 'here i am',
     3 : 'there i am'
     },
     */
    album_list: [5, 7, 1, 2, 0],
    location: [-118.4967633, 34.2622889],

});

var test_user_array = [park, csun, chilis, bangkok];

/*
 for (var i=0; i<test_user_array.length; i++) {
 test_user_array[i].save(function (err, saved_user) {
 if (err) return console.error(err);
 console.log('user saved: \n' + saved_user);
 });
 }
*/
/*
 test_user.save(function (err, test_user) {
 if (err) return console.error(err);
 console.log("test_user saved!");
 });
 */

 //mongoose.model('users').find({}, {}).remove(function(err){
 // console.log((err === null) ? {msg: 'no problems deleting everything!'} : {msg: 'error ' + err});
 //});
