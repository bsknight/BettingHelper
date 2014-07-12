var mongodb = require('./db');

function Schedule(schedule) {
    this.term_id = schedule.term_id
    this.team = schedule.team;
	this.recent = schedule.recent;
    this.schedule = schedule.schedule;
    this.prefer = schedule.prefer;
};


Schedule.prototype.save = function(callback) {
    var schedule = {
        term_id: this.term_id,
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

module.exports = Schedule;

