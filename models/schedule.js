var mongodb = require('./db');

function Schedule(schedule) {
	this.term_id = schedule.term_id;
	this.term = schedule.term;	
	this.id = schedule.id;
    this.team = schedule.team;
	this.recent = schedule.recent;
    this.schedule = schedule.schedule;
    this.prefer = schedule.prefer;
};


Schedule.prototype.save = function(callback) {
    var schedule = {
		term_id: this.term_id,
		term: this.term,
		id: this.id,
        team: this.team,
		recent: this.recent,
        schedule: this.schedule,
        prefer: this.prefer
    };
	mongodb.save('schedule', schedule, function(err) {
		if (err) {
			//console.log('NineGames.prototype.save(): mongodb.save() error');
			return callback(err);
		}
		callback(null);
	});
};

Schedule.getById = function(term, id, callback) {
	db.collection('schedule', function (err, collection) {
		if (err) {
			return callback(err);
		}
		
		var query = {};
		query.term = term;
		query.id = parseInt(id);
		

		collection.findOne(query, function (err, object) {
			if(err) {
				console.log('collection.findOne() err');
				callback(err);
			}
			return callback(null, object);
		});
		
	});
};

Schedule.getByTerm = function(term, callback) {
	db.collection('schedule', function (err, collection) {
		if (err) {
			return callback(err);
		}

		var query = {};
		query.term = term;
		
		collection.find(query).sort({id:1}).toArray(function (err, objectArray) {
			if(err) {
				console.log('collection.findByTerm() err');
				callback(err);
			}
			//console.log(objectArray);
			return callback(null, objectArray);
		});
		
	});
};

module.exports = Schedule;

