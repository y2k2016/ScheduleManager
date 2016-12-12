
var Schedule = require("../../models/Schedule");
var User = require("../../models/User");
var ServiceErrors = require("./serviceErrors");
var Utils = require("../../utils/Utils");

function Service() {}

Service.findScheduleByNameDate = function(name, date, callback) {
	date = new Date(date);
	if (!Utils.isString(name) || isNaN(date.getTime())) {
		return callback(new ServiceErrors.ParamsError("name is not a String or date is an invalid Date"));
	}
	User.findByName(name, function(err, user) {
	    if (err) {
	        return callback(new ServiceErrors.DatabaseError(err.stack));
	    }
	    else if (!user) {
	        return callback(new ServiceErrors.UserNotFoundError("could not found user by name: "+name))
	    }
	    var user_id = user.user_id;
	    Schedule.findByUserID(user_id, function(err, schedules) {
	        if (err) {
	             return callback(new ServiceErrors.DatabaseError(err.stack));
	        }
	        var mess_schedules = []
	        for (var i = 0; i < schedules.length; i++) {
	            if(Utils.isSameDate(date, schedules[i].start_date)) {
	                mess_schedules[mess_schedules.length] = mess_schedules[mess_schedules.length] = {start_date:schedules[i].start_date.toJSON(), end_date:schedules[i].end_date.toJSON()};
	            }
	        }
	        callback(undefined, mess_schedules);
	    })
	})
}

module.exports = Service;