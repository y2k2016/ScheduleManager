var express = require('express');
var router = express.Router();

var service = require("../service");
var ServiceErrors = require("../serviceErrors");

router.post("/", function(req, res, next) {
    var name = req.body.user_name;
    var date = req.body.query_date;

    service.findScheduleByNameDate(name, date, function(err, mess_schedules) {
        if (!err) {
            return res.json({schedules:mess_schedules});
        }

        if (err instanceof ServiceErrors.ParamsError) {
            res.sendStatus(400);
        }
        else if(err instanceof ServiceErrors.DatabaseError) {
            res.sendStatus(500)
        }
        else if (err instanceof ServiceErrors.UserNotFoundError) {
            res.sendStatus(404);
        }
        else {
            // other
            res.sendStatus(500);
        }
    });

});

module.exports = router;