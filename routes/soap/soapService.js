var Schedule = require("../../models/Schedule");
var User = require("../../models/User");
var Utils = require("../../utils/Utils");

var scheduleService = {
	ScheduleService: {
		SchedulePort: {
			getSchedules: function(args, callback) {
				console.log(args);
				try {
					var name = args.user.userName;
					var date = args.user.queryDateTime;
					if (!Utils.isString(name) || !(date instanceof Date)) {
						return callback({});
					}
				}
				catch (err) {
					return callback({});
				}
				User.findByName(name, function(err, user) {
				    if (err || user == null) {
				        return callback({});
				    }
				    var user_id = user.user_id;
				    Schedule.findByUserID(user_id, function(err, schedules) {
				        if (err) {
				             return callback({});
				        }
				        var mess_schedules = []
				        for (var i = 0; i < schedules.length; i++) {
				            if(Utils.isSameDate(date, schedules[i].start_date)) {
				                mess_schedules[mess_schedules.length] = {startDateTime:schedules[i].start_date.toISOString(), endDateTime:schedules[i].end_date.toISOString()};
				            }
				        }
				        callback({schedule:mess_schedules});
				    })
				})
			}
		}
	}
}
var xml = require('fs').readFileSync('./routes/soap/ScheduleService.wsdl', 'utf8');

module.exports = {scheduleService:scheduleService, xml:xml};