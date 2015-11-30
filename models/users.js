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
    match_list: {},
    match_score: String,
    bio: String,
    location: {
        type: [Number], index: '2dsphere'
    },
    following:[{type:mongoose.Schema.Types.ObjectId, ref: 'users'}],
    followers:[{type:mongoose.Schema.Types.ObjectId, ref: 'users'}],
    //album has albumid and playcount
    /*
     album:[
     { album_id: mongoose.Schema.Types.ObjectId,
     playcount: Int
     }

     ],
     */
    match_count: Number
});

var User = mongoose.model('users', personSchema);


/*User.save(function (err) {
    if (err) return handleError(err)
    console.log('Success!');
});*/
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

var test_user2 = User({
        age: 20,
        name: 'Johnny Longjohnny_',
        gender: 'Undefined',
        email: 'Longjohnny@gmail.com',
        album_list: {
            "Reluctant Delirious": "Video Of Citizen",
            "Drooling Metaphor": "Video Of Citizen"
        }
    ,
    location: [-118.4967633, 34.2622889],

});
test_user2.save();
var test_user_array = [park, csun, chilis, bangkok];

//csun.save();

park.following.push(csun);

//park.save();


User
    .find({name:"Park"})
    .populate('following')
    .exec(function (err, users) {
        if (err) return handleError(err);
        console.log('The follower is %s', park.following);
    });
User
    .findOne({name:"Johnny Longjohnny_"})
    .exec(function (err, users) {
        if (err) return handleError(err);
        console.log("here's johnny");
        console.log("current user is " + users);
        for(album_name in users.album_list){
            console.log(album_name + " : " + users.album_list[album_name]);
        }    });

