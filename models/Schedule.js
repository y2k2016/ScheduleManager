
var db = require("./db");
var uuid = require("node-uuid");

function Schedule(schedule) {
	this.schedule_id = schedule.schedule_id;
	this.user_id = schedule.user_id;
	this.title = schedule.title;
	this.description = schedule.description;
	this.start_date = new Date(schedule.start_date);
	this.end_date = new Date(schedule.end_date);

	if (this.schedule_id == undefined) {
		this.schedule_id = uuid.v1();
	}
}

module.exports = Schedule;

db.on("connect", function(err){
	if (err) {throw err;}

	ScheduleModel = db.define("schedule", {
		schedule_id		: {type: "text", key: true},
		user_id			: String,
		title			: String,
		description		: String,
		start_date		: Date,
		end_date		: Date
	});

	Schedule.prototype.toDict = function() {
		var schedule = {};
		schedule.schedule_id = this.schedule_id;
		schedule.user_id = this.user_id;
		schedule.title = this.title;
		schedule.description = this.description;
		schedule.start_date = this.start_date;
		schedule.end_date = this.end_date;
		return schedule;
	}

	Schedule.prototype.create = function(callback) {
		ScheduleModel.create(this.toDict() ,function(err) {
			callback(err);
		});
	}

	Schedule.findByID = function(id, callback) {
		ScheduleModel.find({schedule_id : id}, function(err, schedules) {
			if(err) {
				callback(err, null);
				return;
			}
			if (schedules.length != 1) {
				callback(new Error("..."));
				return;
			}
			callback(err, schedules[0]);
		});
	}

	Schedule.findByUserID = function(user_id, callback) {
		ScheduleModel.find({user_id : user_id}, function(err, schedules) {
			callback(err, schedules);
		});
	}

	Schedule.removeByID = function(schedule_id, callback) {
		ScheduleModel.find({schedule_id:schedule_id}).remove(function(err) {
			callback(err);
		});
	}
	Schedule.prototype.update = function(callback) {
		var schedule = this.toDict();
		ScheduleModel.find({schedule_id : this.schedule_id}, function(err, schedules){
			if(err) {
				callback(err);
				return;
			}
			if(schedules.length != 1) {
				callback(err);
				return;
			}
			schedules[0].title = schedule.title;
			schedules[0].description = schedule.description;
			schedules[0].start_date = schedule.start_date;
			schedules[0].end_date = schedule.end_date;
			schedules[0].save(function(err){
				callback(err);
			});
		});
	}
});