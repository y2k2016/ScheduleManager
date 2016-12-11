var express = require('express');
var router = express.Router();
var Schedule = require('../models/Schedule')
var User = require("../models/User");
var Utils = require("../utils/Utils");

router.post("/", function(req, res, next) {
    try {
        var name = req.body.user_name;
        var date = new Date(req.body.query_date);
        if (!Utils.isString(name) || !(date instanceof Date)) {
            return res.sendStatus(400);
        }
    } catch(err) {
        return res.sendStatus(400);
    }

    User.findByName(name, function(err, user) {
        if (err) {
            return res.sendStatus(500);
        }
        else if (!user) {
            return res.sendStatus(404);
        }
        var user_id = user.user_id;
        Schedule.findByUserID(user_id, function(err, schedules) {
            if (err) {
                 return res.sendStatus(500);
            }
            var mess_schedules = []
            for (var i = 0; i < schedules.length; i++) {
                if(Utils.isSameDate(date, schedules[i].start_date)) {
                    mess_schedules[mess_schedules.length] = mess_schedules[mess_schedules.length] = {start_date:schedules[i].start_date.toJSON(), end_date:schedules[i].end_date.toJSON()};
                }
            }
            res.json({schedules:mess_schedules});
        })
    })

});

module.exports = router;