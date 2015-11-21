var Chance = require('chance');
var mongoose = require('mongoose');
var user = require('./../models/users.js');
var UsersModel = require('mongoose').model('users');
//var AlbumsModel = require('mongoose').model('albums');
var chance= new Chance();
var malename,femname,email,email2,location,location2;
 malename = chance.name({gender: "male"});
 femname =  chance.name({gender: "female"});
 email =  chance.email();
 email2 =  chance.email();
 location =  chance.coordinates();
 location2 =  chance.coordinates();

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