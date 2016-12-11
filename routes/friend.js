var express = require('express');
var router = express.Router();
var Schedule = require('../models/Schedule')
var User = require("../models/User");
var request = require("request");
var soap = require("soap");

function checkLogin(req, res, next) {
    if (!req.session.user_id || !req.session.user_name) {
        return res.sendStatus(401);
    }
    next();
}

var isSameDate = function(a,b){
    return a.getFullYear()  == b.getFullYear() 
            && a.getMonth() == b.getMonth() 
            && a.getDate()  == b.getDate();
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
                    if(isSameDate(date, schedules[i].start_date)) {
                        mess_schedules[mess_schedules.length] = schedules[i];
                    }
                }
                res.json({schedules:mess_schedules});
            })
        })
    }
    else {
        if (serviceType == "restful") {

            var req_url = "";

            request(req_url, function(err, response, body) {
                if (err) {
                    return res.sendStatus(500);
                }
                if (response.statusCode != 200) {
                    return res.sendStatus(404);
                }
                var mess_schedules = body;
                res.json({schedules:mess_schedules});
            });
        }
        else {
            var url = "http://127.0.0.1:3000/wsdl?wsdl";

            var args = {user:{userName: name, queryDateTime:date.toISOString()}};
            soap.createClient(url, function(err, client) {
                client.getSchedules(args, function(err, result) {
                    // console.log(client.lastRequest);
                    console.log(client.lastResponse);
                    console.log(result);
                    if (err) {
                        return res.sendStatus(500);
                    }
                    var mess_schedules = []
                    res.json({schedules:mess_schedules});
                });
            });
        }
    }
});

module.exports = router;