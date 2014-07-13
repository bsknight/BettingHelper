var express = require('express');
var router = express.Router();
var NineGames = require('../models/nineGames.js');
var Odd = require('../models/odd.js');
var Schedule = require('../models/schedule.js');
var BetStrategy = require('../models/betStrategy.js');
var settings = require('../settings');
var async = require('async');

var TERM = settings.term;

/* GET home page. */
getArticle = function(term, id, callback) {

	async.series([	
		function(callback) {
			NineGames.get(TERM, 1, function(err,nineGames) {
				if(err) {
					console.log('NineGames.get() error');
					return callback(err);
				}
				console.log('get nine');
				nineGames.name = '任选九场';
				callback(err, nineGames);
			});				
		},
		
		function(callback) {
			NineGames.get(TERM, 1, function(err,nineGames) {
				if(err) {
					console.log('NineGames.get() error');
					return callback(err);
				}
				console.log('get nine');
				nineGames.name = '任选九场';
				callback(err, nineGames);
			});				
		}		
		
	], function(err, objectArray) {
		if(err) {
			console.log(err);
			return callback(err);
		}
		callback(err, objectArray);
	}); 
	
};

router.get('/', function(req, res) {
	//console.log(TERM);
	getArticle(TERM, 1, function(err, array) {
		if(err) return console.log(err);
		
		console.log(array);
		res.render('index', { articleArray: array });
	});


});

module.exports = router;
