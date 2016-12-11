var express = require('express');
var router = express.Router();
var Schedule = require('../models/Schedule')
var User = require("../models/User");

var isSameDate = function(a,b){
    return a.getFullYear()  == b.getFullYear() 
            && a.getMonth() == b.getMonth() 
            && a.getDate()  == b.getDate();
}

// request:
// 		url: 	http://127.0.0.1:3000/api
// 		method: post
// 		params: {user_name : "y2k", query_date : "2016-12-11T07:45:03.718Z"}

// response:
// 		httpcode:500   error
// 			  	 404   not found
// 			  	 200   {schedules : [
// 			  						{start_date:"2016-12-11T07:45:03.718Z", end_date:"2016-12-11T07:45:03.718Z"},
// 			  						{start_date:"2016-12-11T07:45:03.718Z", end_date:"2016-12-11T07:45:03.718Z"},
// 			  						{start_date:"2016-12-11T07:45:03.718Z", end_date:"2016-12-11T07:45:03.718Z"}
// 			  					    ]
// 			  		   }



router.post("/", function(req, res, next) {
    var name = req.body.user_name;
    var date = new Date(req.body.query_date);

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

});

module.exports = router;