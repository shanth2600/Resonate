var Chance = require('chance');
var UsersModel = require('mongoose').model('users');
//var AlbumsModel = require('mongoose').model('albums');
var user = require('./../models/user.js');

var malename = new Chance.name({gender: "male"});
var femname = new Chance.name({gender: "female"});
var email = new Chance.email();

exports.seedUsers = function seedUsers() {
    UsersModel.find({}).exec(function (err,collection) {
        if (collection.length === 0) {
            UsersModel.create({
                age: chance.age(),
                name: malename,
                gender: 'male',
                email: email
            });
            UsersModel.create({
                age: chance.age(),
                name: femname,
                gender: 'female',
                email: email
            });


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