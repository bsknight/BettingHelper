var mongodb = require('./db');

function NineGames(nineGames) {
    this.term_id = nineGames.term_id
    this.team = nineGames.team;
	this.select = nineGames.select;
    this.detail = nineGames.detail;
    this.prefer = nineGames.prefer;
};


NineGames.prototype.save = function(callback) {
    var nineGames = {
        term_id: this.term_id,
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

module.exports = NineGames;

