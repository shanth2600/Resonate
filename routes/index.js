var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
	mongoose.model('users').find(function(req,users){
		res.send(users);
	});

});

module.exports = router;
