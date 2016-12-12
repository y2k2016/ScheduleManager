
var service = require("../service");
var ServiceErrors = require("../serviceErrors");

var scheduleService = {
	ScheduleService: {
		SchedulePort: {
			getSchedules: function(args, callback) {
				console.log(args);
				if (!args || !args.user) {
					return callback({});
				}
				service.findScheduleByNameDate(args.user.userName, args.user.queryDateTime, function(err, mess_schedules) {
					if (!err) {
						return callback({schedule:mess_schedules});
					}
					console.log(err);
					callback({});
				});
			}
		}
	}
}
var xml = require('fs').readFileSync('./routes/schedule-service/soap/ScheduleService.wsdl', 'utf8');

module.exports = {scheduleService:scheduleService, xml:xml};