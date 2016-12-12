var express = require('express');
var router = express.Router();
var Schedule = require('../models/Schedule')
var User = require("../models/User");
var request = require("request");
var soap = require("soap");
var Utils = require("../utils/Utils");
var accessByRest = require("./accessOther/restClient");
var accessBySoap = require("./accessOther/soapClient");

var Systems = {own:"ScheduleManager1", other:"ScheduleManager2"};
var ServiceType = {restful:"restful", soap:"soap"};

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
    if (!Utils.isString(name) || isNaN(date.getTime())) {
        return res.sendStatus(400);
    }
    var systemType = req.body.systemType;
    var serviceType = req.body.serviceType;

    if (systemType==Systems.own) {
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
        var accessOther;
        if (serviceType == ServiceType.restful) {
            accessOther = accessByRest;
        }
        else {
            accessOther = accessBySoap;
        }
        accessOther(name, date, function(err, mess_schedules) {
            if (err) {
                return res.sendStatus(500);
            }
            res.json({schedules:mess_schedules});
        })
    }
});

module.exports = router;