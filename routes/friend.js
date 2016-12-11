var express = require('express');
var router = express.Router();
var Schedule = require('../models/Schedule')
var User = require("../models/User");
var request = require("request");
var soap = require("soap");
var Utils = require("../utils/Utils");
var accessByRest = require("./accessOther/restClient");
var accessBySoap = require("./accessOther/soapClient");

function checkLogin(req, res, next) {
    if (!req.session.user_id || !req.session.user_name) {
        return res.sendStatus(401);
    }
    next();
}

router.post("/", checkLogin);
router.post("/", function(req, res, next) {
    var name = req.body.friend_name;
    var date = new Date(req.body.date);
    var systemType = req.body.systemType;
    var serviceType = req.body.serviceType;

    if (systemType=="ScheduleManager1") {
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
                        mess_schedules[mess_schedules.length] = schedules[i];
                    }
                }
                res.json({schedules:mess_schedules});
            })
        })
    }
    else {
        if (serviceType == "restful") {
            accessByRest(name, date, function(err, mess_schedules) {
                if (err) {
                    return res.sendStatus(500);
                }
                res.json({schedules:mess_schedules});
            })
        }
        else {
            accessBySoap(name, date, function(err, mess_schedules) {
                if (err) {
                    return res.sendStatus(500);
                }
                res.json({schedules:mess_schedules});
            })
        }
    }
});

module.exports = router;