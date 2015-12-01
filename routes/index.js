var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Chance = require('chance');
var chance = new Chance();
var Faker = require('faker');

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
        res.send(docs[0]);
    });
});

router.get('/finduserbyname/:username', function (req, res, next) {
    var usersToFind = req.params.username;
    mongoose.model('users').find({name: req.params.username}, {}, function (e, docs) {
        res.send(docs);
    });
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

//TODO need to update match algorithm
router.get('/getmatches/:user_id', function (req, res, next) {
    //gets album matches for supplied user ID
    var user_id = req.params.user_id;
    var match_list = [];
    var Users = mongoose.model('users');
    console.log('inside getmatch2');
    Users.findById(user_id, function (err, user) {
        console.log('inside getmatch2-2');
        var returned_users = user;
        mongoose.model('users').find().where('location').near({
            center: {
                type: 'Point',
                coordinates: user[0].location
            },
            maxDistance: 1000
        })
        Users.find().where('_id').ne(user_id).exec(function (err, other_users) {

            console.log('inside getmatch2-3');
            //console.log('docs 1: ' + docs1);
            console.log("other_users: " + other_users);
            returned_users = returned_users + "\n" + other_users;

            var match_count = 0;
            var results_list = "";
            for (var compared_user = 0; compared_user < other_users.length; compared_user++) {

                //find matches between two user's album lists
                for (user_key in user.album_list){
                    if(user_key in other_users[compared_user].album_list){
                        //we have a match
                        console.log('album: ' + user.album_list[user_key] + ' is also in user B\'s album_list: ' + other_users[compared_user].album_list + '\n');
                        match_count++;
                    }else{
                        //we don't have a match
                        console.log('album: ' + user.album_list[user_key] + ' does not exist in user B\'s album_list: ' + other_users[compared_user].album_list + '\n');
                    }
                }
                results_list = results_list + ('match count for user ' + other_users[compared_user].name + ' is: ' + match_count + '<br>');

                //add this user_id plus their match count to a list
                match_list.push({
                    "_id": other_users[compared_user]._id,
                    "name": other_users[compared_user].name,
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

router.get('/getMyUser',function (req, res, next) {
    var Shant = "Shant Hairapetian";
    mongoose.model('users')
    .find({name: Shant}, {})
    .populate('following')
    .exec(function (error, returned_user) {
        res.send(returned_user);
    });
});

//TODO this must be deleted once we don't need a hardcoded user
router.get('/getmatches', function (req, res, next) {
    //gets album matches for supplied user ID
    var Shant = "Shant Hairapetian";
    mongoose.model('users').find({name: Shant}, {}).exec(function (error, returned_user) {

        var user_id = returned_user[0]._id;
        console.log(user_id);
        var match_list = [];        
        var Users = mongoose.model('users');
        Users.findById(user_id, function (err, user) {
            var returned_users = user;
            //Users.find().where('_id').ne(user_id).exec(function (err, other_users) {

                //console.log('docs 1: ' + docs1);
                console.log("other_users: " + other_users);
                returned_users = returned_users + "\n" + other_users;

                mongoose.model('users').find().where('location').near({
                    center: {
                        type: 'Point',
                        coordinates: returned_user[0].location
                    },
                    //50 miles is approx. 80468 meters
                    maxDistance: 80468
                }).where('_id').ne(user_id).exec(function (error, returned_users) {
                    var match_count = 0;
                    var results_list = "";
                    for (var compared_user = 0; compared_user < returned_users.length; compared_user++) {

                        var matches = {};

                        //find matches between two user's album lists
                        for (user_key in user.album_list) {
                            if (user_key in returned_users[compared_user].album_list) {
                                //we have a match
                                console.log('album: ' + user.album_list[user_key] + ' is also in user B\'s album_list: ' + Object.keys(returned_users[compared_user].album_list) + '\n');
                                matches[user_key] = user.album_list[user_key];
                                match_count++;
                            } else {
                                //we don't have a match
                                console.log('album: ' + user.album_list[user_key] + ' does not exist in user B\'s album_list: ' + Object.keys(returned_users[compared_user].album_list) + '\n');
                            }
                        }
                        results_list = results_list + ('match count for user ' + returned_users[compared_user].name + ' is: ' + match_count + '<br>');

                        returned_users[compared_user].match_list = matches;
                        returned_users[compared_user].match_score = match_count;

                        //add this user_id plus their match count to a list
                        var other_user_results = [returned_users[compared_user], match_count];
                        match_list.push(other_user_results);
                        //reset the match_count back to 0
                        match_count = 0;
                    }

                    console.log('unsorted match list \n');
                    console.log(match_list);
                    console.log('\n');

                    match_list.sort(function (a, b) {
                        return b[1] - a[1];
                    });

                    console.log('sorted match list \n');
                    console.log(match_list);
                    res.send(match_list);
                });
           // });
        });
    });//end Shant .exec
});

function getUsersByProximity(user_id, callback) {
    var user_model = mongoose.model('users');
    var user1 = user_model.find({_id: user_id}, {}, function (error, current_user) {
        console.log('current user is:\n' + current_user);
        console.log('current location is: ' + current_user[0].location);
        mongoose.model('users').find().where('location').near({
            center: {
                type: 'Point',
                coordinates: current_user[0].location
            },
            //12 miles is approx. 19312 meters
            maxDistance: 19312
        }).where('_id').ne(user_id).exec(function (error, returned_users) {
            console.log(error);
            console.log('found users:\n' + returned_users);
            callback(null, returned_users);
            return returned_users;

        });
    });
}

router.get('/getusersbyproximity/:user1', function (req, res, next) {
    var user_id = req.params.user1;
    getUsersByProximity(user_id, function (err, returned_users) {
        res.send(returned_users);

    });

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

router.get('/addToMyFollowing/:user',function(req, res, next){
    var Shant = "Shant Hairapetian";
    mongoose.model('users').find({name: Shant}, {}).exec(function (error, returned_user) {
        // res.send(returned_user[0].id);
        addToFollowing(returned_user[0].id,req.params.user);
        res.send(200);
    });

});

router.post('/addtofollowing', function (req, res, next) {
    //gets the user ID of the new follower and the person being followed and updates the followed/following lists for each
    var follow_info = req.body;
    var user_following_id = follow_info.following;
    var user_followed_id = follow_info.followed;
    addToFollowing(user_following_id, user_followed_id, function (err, updated_users) {
        if (err) {
            //TODO replace with better error handling later
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });

});

function addToFollowing(user_following_id, user_followed_id, callback) {
    //function that updates the follower/followed lists in the database of two users
    console.log("user_following_id: " + user_following_id);
    console.log("user_followed_id: " + user_followed_id);
    var Users = mongoose.model('users');
    Users.findById(user_following_id, function (err, user_following) {
        if (err) {
            console.log("Error finding: " + user_following_id);
            callback("Error finding: " + user_following_id);
            return ("Error finding " + user_following_id);
        } else {
            Users.findById(user_followed_id, function (err, user_followed) {
                if (err) {
                    console.log("Error finding: " + user_followed_id);
                    callback("Error finding: " + user_followed_id);
                    return ("Error finding " + user_followed_id);
                }
                else {
                    if (user_following.following.indexOf(user_followed_id) == -1) {
                        console.log("user_following: " + user_following_id + "isn't following: " + user_followed_id);
                        user_following.following.push(user_followed);
                        user_following.save(function (err) {
                            if (err) {
                                console.log("Couldn't save " + user_following + " to the database.");
                                callback("Couldn't save " + user_following + " to the database.");
                                return ("Couldn't save " + user_following + " to the database.");
                            }
                        });
                    }

                    if (user_followed.followers.indexOf(user_following_id) == -1) {
                        console.log("user_followed: " + user_followed_id + "isn't being followed by: " + user_following_id);
                        user_followed.followers.push(user_following);
                        user_followed.save(function (err) {
                            if (err) {
                                console.log("Couldn't save " + user_followed + " to the database.");
                                callback("Couldn't save " + user_followed + " to the database.");
                                return ("Couldn't save " + user_followed + " to the database.");
                            }
                        });
                    }
                    if (callback) {
                        callback(null, user_following);
                    }
                    //return zero to indicate OK
                    return (0);
                }
            });
        }
    });
}

router.get('/seeder', function (req, res, next) {
    mongoose.model('users').find({}, {}).remove(function (err) {
        console.log((err === null) ? {msg: 'no problems deleting everything!'} : {msg: 'error ' + err});

    }).exec(function () {

        var personSchema = require('mongoose').model('users').schema;
        var NewUser = mongoose.model('users', personSchema);

        var Shant_Hairapetian = NewUser({
            age: 24,
            name: "Shant Hairapetian",
            gender: "Male",
            email: "Shant.Shant.Shant@my.csun.edu",
            profile_image: Faker.image.avatar(),
            album_list: itunes_albums,
            bio: "Hello World.",
            location: [-118.527178, 34.242349]

        });
        Shant_Hairapetian.save(function (err, test_user) {
            if (err) return console.error(err);
        });

        var i = 0;
        while (i < 50) {

            var new_user = NewUser({
                age: chance.age(),
                name: chance.name(),
                gender: chance.gender(),
                email: chance.email(),
                profile_image: Faker.image.avatar(),
                album_list: seedAlbums(),
                bio: chance.paragraph(),
                location: [chance.floating({min: -118.849621, max: -117.838879, fixed: 6}),
                    chance.floating({min: 33.741245, max: 34.507465, fixed: 6})]

            });
            new_user.save(function (err, test_user) {
                if (err) return console.error(err);
            });
            i++;
        }



        res.redirect('/');

    });
});

function seedAlbums() {
    console.log("Length is " + Object.keys(seed_albums).length);

    var number_of_albums = Math.floor(Math.random() * 25 + 3);
    var new_album_list = {};
    var new_album_name;
    var new_album_artist_name;
    var album_index;
    var matched_album = [];
    console.log("Number of albums: " + number_of_albums);
    for (var j = 0; j < number_of_albums; j++) {
        if (Math.floor(Math.random() * 100) >= 80) {
            album_index = Math.floor(Math.random() * Object.keys(itunes_albums).length);
            new_album_name = Object.keys(itunes_albums)[album_index];
            new_album_artist_name = itunes_albums[new_album_name];
            new_album_list[new_album_name] = new_album_artist_name;
            matched_album.push(new_album_name);
        }
        else {
            album_index = Math.floor(Math.random() * Object.keys(seed_albums).length);
            new_album_name = Object.keys(seed_albums)[album_index];
            new_album_artist_name = seed_albums[new_album_name];
            new_album_list[new_album_name] = new_album_artist_name;
        }
    }
    console.log(new_album_list);
    console.log("Album matches:");
    console.log(matched_album);
    return new_album_list;

}

router.get('/cleardb', function (req, res, next) {
    mongoose.model('users').find({}, {}).remove(function (err) {
        console.log((err === null) ? {msg: 'no problems deleting everything!'} : {msg: 'error ' + err});

    }).exec(function () {
        res.redirect('/');
    });
});

var seed_albums = {
    "Reluctant Delirious": "Video Of Citizen",
    "Drooling Metaphor": "Video Of Citizen",
    "Iguana Tribute": "Overgrown Trinity",
    "Exotic Barbituate": "Sanction Of The Dreaded Cube",
    "Plain Of The Mainly": "Reign Disorder",
    "Father Fence": "Bath Of Whisper",
    "Barley Of The Space": "Saving Nudist",
    "Deluxe Metaphor": "Eyelash Of The Getting Cheese",
    "Texture Gas": "Tender Finger",
    "Washer Simplicity": "Curvy Session And The Brick",
    "Disappointed Salmon": "Moldy Extinction",
    "Bung Moron": "Bottom Of Management",
    "Hetero Commitment": "Tiger Bleach",
    "Worm Fox": "Girlfriend Of The Sucky Rigor",
    "Thrashing Beer": "Unit Of Unused",
    "Pixie Down Endeavor": "Eighth Golden",
    "Placid Beat": "Distinct Reporting",
    "From Beethoven": "Playing Wire",
    "Allegiance Gnome": "From Beast",
    "Lymph Thrill": "Feeding Clover",
    "Any Peace": "Five Pussy",
    "Decrepit Crowbar": "Multiple Church",
    "Abandoned Freedom": "Humility Of The Barley",
    "Anorexic Melody": "Pissed Empathy",
    "Flea Of The Unseen Samantha": "Flannel Hydrogen",
    "Cobra Of Whack": "Voodoo Jaw",
    "Recessive Ravioli": "Nitrogen Of The Ointment",
    "Beyond Rescue": "Skimpy Alcohol",
    "Adventure Stop": "Vagrant Without Engine",
    "Shrine Bite": "Clue Of Aurora",
    "Incest Fable": "Miscarriage Of The Light",
    "Own Of The Scare": "Cock Senate",
    "Healthy Manipulator": "Godfather Damaged",
    "Fake Vitamin": "Emo Nightclub",
    "Make-believe Cocaine And The Tron": "Emo Nightclub",
    "Bella Bleach": "Entitled Koala",
    "Buddha Rake Of The Fork Electricity": "",
    "Hairy Emo": "Lockjaw Of The Pregnant Standard",
    "Fetish Between Voltage": "With Proxy",
    "Slapping Summer": "Long Beast",
    "Murder Beach": "Proud Omission",
    "Hammock Ordinance": "Natural Victory",
    "Beyond Sibling": "Undefined Eye",
    "Cosmo Junkie": "Mock Of The Sourberry",
    "Blatant Justice": "Fader Of The Tendency",
    "Wasteland Squid": "Glimpse Among Rin-tin-tin",
    "Cabbage Gnat": "Decaying Spooge",
    "Rash Maze": "Regression Of The Desktop",
    "Ecstacy After Rumble": "Nebula Of The Fault",
    "Astral Cushion And The Shrapnel Zodiac": "",
    "Self-inflicted Prozac": "Gyro Television",
    "Chewy Sense": "Blast Figure",
    "Mach Tron": "Excess Kitchen",
    "Driver Stark": "Racer Belief",
    "Absent Speaker And The Rigid Hotline": "Racer Belief"
};
var itunes_albums =
{
    "Rareform (Re-Recorded)": "After the Burial",
    "Riders of the Plague": "The Absence",
    "Sheol": "Naglfar",
    "VII: Sturm Und Drang (Deluxe)": "Lamb of God",
    "Arrows & Anchors (Deluxe Edition)": "Fair to Midland",
    "Artifacts In Motion": "Circle of Contempt",
    "Messengers": "August Burns Red",
    "From Afar": "Ensiferum",
    "Nothing": "Meshuggah",
    "Thrones": "Alaya",
    "Breathe": "The Young Dubliners",
    "Night Is the New Day (Special Edition)": "Katatonia",
    "Reroute to Remain": "In Flames",
    "Haunt What\'s Left": "This Or The Apocalypse",
    "Nocturne": "The Human Abstract",
    "Volition": "Protest the Hero",
    "A Voice Within": "Intervals",
    "Monument": "Miss May I",
    "Digital Veil": "The Human Abstract",
    "Animals As Leaders": "Animals As Leaders",
    "Sorrow and Extinction": "Pallbearer",
    "Uit Oude Grond": "Heidevolk",
    "Stormblast": "Dimmu Borgir",
    "V": "Scale the Summit",
    "CVI": "Royal Thunder",
    "Fables From a Mayfly: What I Tell You Three Times is True": "Fair to Midland",
    "Ritual": "The Black Dahlia Murder",
    "They Will Return": "Kalmah",
    "The Never Ending Way of ORwarriOR": "Orphaned Land",
    "Infestissumam (Deluxe Version)": "Ghost B.C.",
    "One Reality": "Texas in July",
    "Hildebrandslied": "Menhir",
    "Take This Time - Single": "Mikel Petrossian",
    "The Collective": "Scale the Summit",
    "In Dreams": "After the Burial",
    "Asleep Next to Science": "Orbs",
    "Ont\' Sofa Vol 1": "Billie Marten",
    "Zero Order Phase": "Jeff Loomis",
    "Lingua Franca - EP": "T.R.A.M",
    "Midan": "Eileen Khatchadourian",
    "Sworn To The Dark": "Watain",
    "Basal Ganglia - EP": "Mest�s",
    "Periphery": "Periphery",
    "Thirteenth Step": "A Perfect Circle",
    "Victory Songs": "Ensiferum",
    "Opus Eponymous": "Ghost B.C.",
    "Lore": "Today I Caught the Plague",
    "Episode 27 - Ghosts of the Ostfront I (feat Dan Carlin)": "Dan Carlin's Hardcore History",
    "Helvetios": "Eluveitie",
    "The Quantum Hack Code": "Amogh Symphony",
    "Come Clarity": "In Flames",
    "The Joy of Motion": "Animals As Leaders",
    "Carving Desert Canyons": "Scale the Summit",
    "Seventy One Percent - EP": "The Alaya Conscious",
    "True Survivor (From \"Kung Fury\") - Single": "David Hasselhoff",
    "Everything Remains (As It Never Was)": "Eluveitie",
    "Periphery II": "Periphery",
    "Grind the Ocean": "The Safety Fire",
    "THREE": "Numbers",
    "Fortress": "Protest the Hero",
    "Sunset On the Golden Age (Deluxe Version)": "Alestorm",
    "Meliora": "Ghost",
    "Scurrilous": "Protest the Hero",
    "Juggernaut: Alpha": "Periphery",
    "Live At Madison Square Garden": "Louis CK",
    "Fire Up the Blades": "3 Inches of Blood",
    "In Waves (Special Edition)": "Trivium",
    "One of Us Is the Killer": "The Dillinger Escape Plan",
    "Great White Whale": "Secret & Whisper",
    "Time I": "Wintersun",
    "The Common Man\'s Collapse": "Veil of Maya",
    "Truth and Purpose": "I the Breather",
    "Tenacious D": "Tenacious D",
    "These Are My Sins": "I the Breather",
    "With Roots Above and Branches Below": "The Devil Wears Prada",
    "Weightless": "Animals As Leaders",
    "Invade": "Within the Ruins",
    "Dead Throne": "The Devil Wears Prada",
    "An Ocean Between Us": "As I Lay Dying",
    "The Parallax II: Future Sequence": "Between the Buried and Me",
    "Monarchy (feat Dan Tompkins) - Single": "Star Monarchy",
    "The Lion\'s Roar (Bonus Track Version)": "First Aid Kit",
    "Reinkaos": "Dissection",
    "Juggernaut: Omega": "Periphery",
    "Once More \'Round the Sun": "Mastodon",
    "Swans - EP": "Galleons",
    "Thrill Seeker": "August Burns Red",
    "Volume 1": "Star Monarchy",
    "Pulse": "Thomas Giles",
    "Sons of Northern Darkness": "Immortal",
    "Fantasies": "Metric",
    "Deflorate": "The Black Dahlia Murder",
    "At Daggers Drawn": "Sea of Treachery",
    "Sacrament": "Lamb of God",
    "Bright Side of Life (Bonus Track Version)": "Rebelution",
    "Brumlebassen": "TrollfesT",
    "True Detective (Music From the HBO Series)": "Lera Lynn",
    "Viides Luku - Havitetty": "Moonsorrow",
    "Genocide (,Collection)": "Sahag Sahagian",
    "Beyond the Gate": "Wretched",
    "Made In Armenia": "Ophelia Hampartsoumian",
    "Apocryphon": "The Sword",
    "Alone": "Evan Brewer",
    "Option Paralysis (Special Edition)": "The Dillinger Escape Plan",
    "Origins (Bonus Track Version)": "Eluveitie",
    "Ulg": "Metsat�ll",
    "Separate Realities": "Trioscapes",
    "Black Waltz": "Kalmah",
    "Make Total Destroy - Single": "Periphery",
    "Leveler (Deluxe Edition)": "August Burns Red",
    "Diffusion": "7for4",
    "The Migration": "Scale the Summit",
    "A Sense Of Purpose": "In Flames",
    "Storm Of The Light\'s Bane": "Dissection",
    "Ten$ion": "Die Antwoord",
    "Plagues": "The Devil Wears Prada",
    "Carbon-Based Anatomy - EP": "Cynic",
    "Cold Beer (Cry Tunes) - Single": "Jesse Stewart",
    "Everblack": "The Black Dahlia Murder",
    "Murder the Mountains": "Red Fang",
    "The Ol\' Soul EP": "Alpoko Don",
    "Clear": "Periphery",
    "Garden Window": "O\'Brother",
    "Constellations": "August Burns Red",
    "Noita": "Korpiklaani",
    "Seventh Swamphony (US version)": "Kalmah",
    "Sounds of a Playground Fading (Deluxe Edition)": "In Flames",
    "Soundtrack To Your Escape": "In Flames",
    "Abysmal": "The Black Dahlia Murder",
    "The Symphonies: Dreams Memories & Parties": "Emily Wells",
    "1184": "Windir",
    "Reticence - The Musical": "Art By Numbers",
    "The New Reign": "Born of Osiris",
    "At The Dream\'s Edge": "Chimp Spanner",
    "A Matter of Life and Death": "Iron Maiden",
    "Wrath": "Lamb of God",
    "The Drawn & Quartered EP": "Fair to Midland",
    "Erotic Cakes": "Guthrie Govan",
    "Februus": "Uneven Structure",
    "Yerke Nayev Aghotk E": "Harout Pamboukjian & Rouben Hakhverdian",
    "Sound Awake": "Karnivool",
    "Redwoods - Single": "Scale the Summit",
    "By the Light of the Northern Star": "T�r",
    "Clayman": "In Flames",
    "This Type of Thinking (Could Do Us In)": "Chevelle",
    "Ad Majorem Sathanas Gloriam": "Gorgoroth",
    "Colors": "Between the Buried and Me",
    "Race Music": "Armand Hammer",
    "Stay Gold": "First Aid Kit",
    "Frail Words Collapse": "As I Lay Dying",
    "Wave of Babies - Single": "Animals As Leaders",
    "For The Revolution": "Kalmah",
    "One": "TesseracT",
    "The Fury of Our Maker\'s Hand": "DevilDriver",
    "Valkyrja": "T�r",
    "Miasma": "The Black Dahlia Murder",
    "The King Is Dead": "The Decemberists",
    "The Way of All Flesh": "Gojira",
    "This Is the Warning": "Dead Letter Circus",
    "Vengeance Falls": "Trivium",
    "[id]": "Veil of Maya",
    "Seaborne - EP": "Apostate",
    "Les voyages de l\'�me": "Alcest",
    "Rhythm, Chord & Melody": "The Reign of Kindo",
    "Shogun": "Trivium",
    "Atonement": "Fred Brum",
    "Yellow & Green": "Baroness",
    "M�sstaden": "vildhjarta",
    "The Great Cold Distance": "Katatonia",
    "Disclosure": "The HAARP Machine",
    "No World for Tomorrow": "Coheed and Cambria",
    "Ashes Of The Wake": "Lamb of God",
    "The Somberlain": "Dissection",
    "New Found Power": "Damageplan",
    "Deloused In the Comatorium": "The Mars Volta"
};
module.exports = router;
