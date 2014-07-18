var mongodb = require('./db');

function NineGames(nineGames) {
	this.term_id = nineGames.term_id;
	this.term = nineGames.term;
	this.id = nineGames.id;
    this.team = nineGames.team;
	this.select = nineGames.select;
    this.detail = nineGames.detail;
    this.prefer = nineGames.prefer;
};


NineGames.prototype.save = function(callback) {
    var nineGames = {
		term_id: this.term_id,
		term: this.term,
		id: this.id,
        team: this.team,
		select: this.select,
        detail: this.detail,
        prefer: this.prefer
    };
	mongodb.save('nineGames', nineGames, function(err) {
		if (err) {
			//console.log('NineGames.prototype.save(): mongodb.save() error');
			return callback(err);
		}
		callback(null);
	});
};

NineGames.getById = function(term, id, callback) {
	db.collection('nineGames', function (err, collection) {
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

NineGames.getByTerm = function(term, callback) {
	db.collection('nineGames', function (err, collection) {
		if (err) {
			return callback(err);
		}

		var query = {};
		query.term = term;
		
		collection.find(query).sort({id:1}).toArray(function (err, objectArray) {
			if(err) {
				console.log('collection.find() err');
				callback(err);
			}
			//console.log(objectArray);
			return callback(null, objectArray);
		});
		
	});
};

module.exports = NineGames;

