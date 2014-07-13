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
			NineGames.get(TERM, id, function(err,nineGames) {
				if(err) {
					console.log('NineGames.get() error');
					return callback(err);
				}
				console.log('get nineGames');
				nineGames.name = '任选九场';
				callback(err, nineGames);
			});				
		},
		
		function(callback) {
			BetStrategy.get(TERM, id, function(err,betStrategy) {
				if(err) {
					console.log('BetStrategy.get() error');
					return callback(err);
				}
				console.log('get betStrategy');
				betStrategy.name = '投注策略';
				callback(err, betStrategy);
			});				
		},

		function(callback) {
			Schedule.get(TERM, id, function(err,schedule) {
				if(err) {
					console.log('Schedule.get() error');
					return callback(err);
				}
				console.log('get schedule');
				schedule.name = '赛程前瞻';
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


router.get('/:i', function(req, res) {
	var id = req.param('i');
	getArticle(TERM, id, function(err, array) {
		if(err) return console.log(err);
		//console.log(array);
		res.render('index', { articleArray: array });
	});
});

module.exports = router;
