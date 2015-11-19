var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Chance = require('chance');
var chance = new Chance();

/*
 //**************change this
 var personSchema= new mongoose.Schema ({
 person_id: mongoose.Schema.Types.ObjectId,
 age: Number,
 name: String,
 gender: String,
 email: String,
 location: {
 coordinates: {type: [Number], index: '2dsphere'}
 },
 //album has albumid and playcount
 /*
 album:[
 { album_id: mongoose.Schema.Types.ObjectId,
 playcount: Int
 }

 ],

 });
 */
//*****************

/* GET home page. */

router.get('/', function (req, res, next) {
    mongoose.model('users').find(function (req, users) {
        res.send(users);
    });

});

router.delete('/', function (req, res, next) {
    mongoose.model('users').find(function (req, users) {
        res.send(users);
    });

});

/*
 router.get('/', function(req, res, next) {
 getAllUsers('users', function(res, retrieved_users){
 console.log("retrieved users: " + retrieved_users);
 res.send(retrieved_users)
 });
 console.log("index");
 res.send("index");

 });


 */
function getAllUsers(model_name) {
    //not used currently
    var returned_users;
    mongoose.model('users').find(function (req, users) {
        returned_users = users;
        console.log("these are the users!");
        console.log(returned_users);
    });

    //func(returned_users);
    return returned_users;
}

router.get('/getuserbyid/:id/:name', function (req, res, next) {
    res.send("getting users here " + req.params.id + "username over here is " + req.params.name);
});

router.get('/deleteuserbyid/:user_id', function (req, res, next) {
    var userToDelete = req.params.user_id;
    console.log("user to delete is: " + userToDelete);
    mongoose.model('users').find({_id: userToDelete}).remove(function (err) {
        console.log((err == null) ? {msg: ''} : {msg: 'error ' + err});
        res.redirect('/');
    });
});

//used for deleting users via the DELETE HTTP request. Might be used in place of the GET version. For now, both are here.
router.delete('/deleteuserbyid/:user_id', function (req, res) {
    var userToDelete = req.params.user_id;
    console.log("user to delete is: " + userToDelete);
    mongoose.model('users').find({_id: userToDelete}).remove(function (err) {
        console.log((err == null) ? {msg: ''} : {msg: 'error ' + err});
        res.redirect('/');
    });
});

router.get('/deleteuserbyname/:username', function (req, res, next) {
    var usersToDelete = req.params.username;
    console.log('Users to delete have the name' + usersToDelete);
    mongoose.model('users').find({name: usersToDelete}, {}).remove(function (err) {
        console.log((err === null) ? {msg: 'no problems deleting users!'} : {msg: 'error ' + err});
        res.redirect('/');
    });
});

router.delete('/deleteuserbyname/:username', function (req, res, next) {
    var usersToDelete = req.params.username;
    console.log('Users to delete have the name' + usersToDelete);
    mongoose.model('users').find({name: usersToDelete}, {}).remove(function (err) {
        console.log((err === null) ? {msg: 'no problems deleting users!'} : {msg: 'error ' + err});
        res.redirect('/');
    });
});

router.get('/finduserbyid/:user_id', function (req, res, next) {
    var userToFind = req.params.user_id;
    mongoose.model('users').find({_id: req.params.user_id}, {}, function (e, docs) {
        res.json(docs);
    })
});

router.get('/finduserbyname/:username', function (req, res, next) {
    var usersToFind = req.params.username;
    mongoose.model('users').find({name: req.params.username}, {}, function (e, docs) {
        res.json(docs);
    })
});

router.post('/adduser', function (req, res, next) {
    var new_user_info = req.body;
    console.log("new user name: " + new_user_info.name);
    console.log("new user info is: " + new_user_info);

    //get the schema from a previously created mongoose model
    var personSchema = require('mongoose').model('User').schema;

    var NewUser = mongoose.model('User', personSchema);
    console.log("new user info is: " + new_user_info);

    //debugging purposes, see what's inside of the body of the post request
    for (key in new_user_info) {
        console.log("key is: " + key);
        console.log(key + " : " + new_user_info[key]);
    }

    new_user = NewUser({
        age: new_user_info.age,
        name: new_user_info.name,
        gender: new_user_info.gender,
        email: new_user_info.email,
        location: new_user_info.location,

    });
    new_user.save(function (err, test_user) {
        if (err) return console.error(err);
        console.log("test_user saved!");
        res.redirect('/');
    });
});

router.get('/getmatch/:user1/:user2', function (req, res, next) {
    user1 = req.params.user1;
    user2 = req.params.user2;
    mongoose.model('users').find({_id: user1}, {}, function (e, docs1) {
        var returned_users = docs1;
        mongoose.model('users').find({_id: user2}, {}, function (e, docs2) {
            returned_users = returned_users + "\n" + docs2;
            for (key in docs1) {
                console.log("key is: " + key);
                console.log(key + " : " + docs1[key]);
            }
            console.log("user A album at index 0: " + docs1[0].album_list[0] + " user B album at index 1 " + docs2[0].album_list[2]);
            var match_count = 0;

            //find matches between two user's album lists
            for (var i = 0; i < docs1[0].album_list.length; i++) {
                if (docs2[0].album_list.indexOf(docs1[0].album_list[i]) === -1) {
                    console.log('album: ' + docs1[0].album_list[i] + ' does not exist in user B\'s album_list: ' + docs2[0].album_list + '\n');
                } else {
                    console.log('album: ' + docs1[0].album_list[i] + ' is also in user B\'s album_list: ' + docs2[0].album_list + '\n');

                    match_count++;
                }
            }
            /*
             for (album in docs1[0].album_list){
             if (docs2[0].album_list.indexOf[album] === -1){
             console.log('album: ' + album + ' does not exist in user B\'s album_list: ' + docs2[0].album_list + '\n');
             }else{
             console.log('album: ' + album + ' is also in user B\'s album_list: ' + docs2[0].album_list + '\n');

             match_count++;
             }
             }
             */
            console.log('match count is: ' + match_count);
            res.send(returned_users);
        });
    });
});

router.get('/getmatches/:user1', function (req, res, next) {
    var user1 = req.params.user1;
    var match_list = [];
    console.log('inside getmatch2');
    mongoose.model('users').find({_id: user1}, {}, function (e, docs1) {
        console.log('inside getmatch2-2');
        var returned_users = docs1;
        mongoose.model('users').find().where('_id').ne(user1).exec(function (err, docs2) {
            console.log('inside getmatch2-3');
            //console.log('docs 1: ' + docs1);
            console.log("docs 2: " + docs2);
            returned_users = returned_users + "\n" + docs2;

            var match_count = 0;
            var results_list = "";
            for (var compared_user = 0; compared_user < docs2.length; compared_user++) {

                //find matches between two user's album lists
                for (var i = 0; i < docs1[0].album_list.length; i++) {
                    if (docs2[compared_user].album_list.indexOf(docs1[0].album_list[i]) === -1) {
                        console.log('album: ' + docs1[0].album_list[i] + ' does not exist in user B\'s album_list: ' + docs2[compared_user].album_list + '\n');
                    } else {
                        console.log('album: ' + docs1[0].album_list[i] + ' is also in user B\'s album_list: ' + docs2[compared_user].album_list + '\n');

                        match_count++;
                    }
                }
                results_list = results_list + ('match count for user ' + docs2[compared_user].name + ' is: ' + match_count + '<br>');

                //add this user_id plus their match count to a list
                match_list.push({
                    "_id": docs2[compared_user]._id,
                    "name": docs2[compared_user].name,
                    "match_count": match_count
                });
                //reset the match_count back to 0
                match_count = 0;
            }

            console.log('unsorted match list \n');
            console.log(match_list);
            console.log('\n');

            match_list.sort(function (a, b) {
                return b.match_count - a.match_count;
            });

            console.log('sorted match list \n');
            console.log(match_list);
            res.send(match_list);
        });
    });
});


router.get('/getusersbyproximity/:user1', function (req, res, next) {
    var user_id = req.params.user1;
    var user_model = mongoose.model('users');
    var user1 = user_model.find({_id: user_id}, {}, function (error, current_user) {
        console.log('current user is:\n' + current_user);
        console.log('current location is: ' + current_user[0].location);
        mongoose.model('users').find().where('location').near({
            center: {
                type: 'Point',
                coordinates: current_user[0].location
            },
            maxDistance: 10000000000000000000000000
        }).exec(function (error, returned_users) {
            console.log(error);
            console.log('found users:\n' + returned_users);
            res.send(returned_users);

        });
    });
});

// router.get('/seeder', function (req, res, next){
//     var personSchema = require('mongoose').model('users').schema;
//     var NewUser = mongoose.model('users', personSchema);

//     var i = 0;
//     while (i<50) {

//         var new_user = NewUser({
//             age: chance.age(),
//             name: chance.name(),
//             gender: chance.gender(),
//             email: chance.email(),
//             profile_image: chance.url({path: 'images'}),
//             location: [chance.floating({min: -180, max: 180, fixed: 6}),
//                 chance.floating({min: -90, max: 90, fixed: 6})]

//         });

//         new_user.save(function (err, test_user) {
//             if (err) return console.error(err);
//             console.log("test_user saved!");
//         });
//         i++;
//     }
//     res.redirect('/');

// });

module.exports = router;
