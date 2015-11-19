var Chance = require('chance');
var UsersModel = require('mongoose').model('users');
//var AlbumsModel = require('mongoose').model('albums');
var user = require('./../models/users.js');

var malename = new Chance.name({gender: "male"});
var femname = new Chance.name({gender: "female"});
var email = new Chance.email();
var email2 = new Chance.email();
var location = new Chance.coordinates();
var location2 = new Chance.coordinates();

exports.seedUsers = function seedUsers() {
    //clear collection?
    UsersModel.remove({}, function(err) {
        console.log('collection removed')
    });
    //check if collection is empty then populate until
    //100 entries?
    UsersModel.find({}).exec(function (err,collection) {
        if (collection.length === 0) {
            //while(collection.length<=100) {
                UsersModel.create({
                    age: chance.age(),
                    name: malename,
                    gender: 'male',
                    email: email,
                    location: location
                });
                UsersModel.create({
                    age: chance.age(),
                    name: femname,
                    gender: 'female',
                    email: email2,
                    location: location2
                });

            //}
        }
    });
};
/*exports.seedAlbums = function seedAlbums(){
    AlbumsModelfind({}).exec(function (err,collection){
        if (collection.length ===0 {
            AlbumsModel.create({

            }
            )
        }
    })

}
*/