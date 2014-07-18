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
getArticle = function(term, callback) {

	async.series([	
		function(callback) {
			NineGames.getByTerm(TERM, function(err,nineGames) {
				if(err) {
					console.log('NineGames.getByTerm() error');
					return callback(err);
				}
				console.log('get nineGames');
				callback(err, nineGames);
			});				
		},

		function(callback) {
			BetStrategy.getByTerm(TERM, function(err,betStrategy) {
				if(err) {
					console.log('BetStrategy.getByTerm() error');
					return callback(err);
				}
				console.log('get betStrategy');
				callback(err, betStrategy);
			});				
		},
		
		function(callback) {
			Schedule.getByTerm(TERM, function(err,schedule) {
				if(err) {
					console.log('Schedule.getByTerm() error');
					return callback(err);
				}
				console.log('get schedule');
				callback(err, schedule);
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
	//var id = req.param('i');
	getArticle(TERM, function(err, array) {
		if(err) return console.log(err);
		//console.log(array);
		res.render('index', { articleArray: array });
	});
});

module.exports = router;
