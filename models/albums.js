var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumsSchema = new Schema({
    album_id: Number,
    name: String,
    artist: String,
    genre: String

});

mongoose.model('albums', albumsSchema);