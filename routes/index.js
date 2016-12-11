var express = require('express');
var router = express.Router();
var Schedule = require("../models/Schedule");

function checkLogin(req, res, next) {

	if (!req.session.user_id || !req.session.user_name) {
		return res.sendStatus(401);
	}

	next();
}

router.get('/', function(req, res, next) {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth();

	if (!req.session.user_id) {
		return res.render('index', {date:date, schedules:null, user_name:null});
	}

	var user_id = req.session.user_id;

	Schedule.findByUserID(user_id, function(err, schedules) {
		if (err) {

		}
		else {
			var mess_schedule = [];
			for (var i = schedules.length - 1; i >= 0; i--) {
				if(year == schedules[i].start_date.getFullYear() && month == schedules[i].start_date.getMonth()) {
					mess_schedule[mess_schedule.length] = schedules[i];
				}
			}

			res.render('index', {date:date, schedules:mess_schedule, user_name:req.session.user_name});
		}
	});
  	
});

router.post("/", checkLogin);
router.post("/", function(req, res, next) {
	var year = req.body.year;
	var month = req.body.month;

	var user_id = req.session.user_id;

	Schedule.findByUserID(user_id, function(err, schedules) {
		if (err) {
			res.sendStatus(500);
		}
		else {
			var mess_schedule = [];
			for (var i = schedules.length - 1; i >= 0; i--) {
				if(year == schedules[i].start_date.getFullYear() && month == schedules[i].start_date.getMonth()) {
					mess_schedule[mess_schedule.length] = schedules[i];
				}
			}
			res.json({year:year, month:month, schedules:mess_schedule});
		}

	});
})

module.exports = router;
