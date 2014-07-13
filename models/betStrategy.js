var mongodb = require('./db');

function BetStrategy(betStrategy) {
	this.term_id = betStrategy.term_id;
	this.id = betStrategy.id;
	this.term = betStrategy.term;
    this.team = betStrategy.team;
	this.type = betStrategy.type;
    this.detail = betStrategy.detail;
    this.prefer = betStrategy.prefer;
};


BetStrategy.prototype.save = function(callback) {
    var betStrategy = {
		term_id: this.term_id,
		term: this.term,
		id: this.id,
        team: this.team,
		type: this.type,
        detail: this.detail,
        prefer: this.prefer
    };
	mongodb.save('betStrategy', betStrategy, function(err) {
		if (err) {
			//console.log('NineGames.prototype.save(): mongodb.save() error');
			return callback(err);
		}
		callback(null);
	});
};

BetStrategy.get = function(term, id, callback) {
	db.collection('betStrategy', function (err, collection) {
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

module.exports = BetStrategy;

