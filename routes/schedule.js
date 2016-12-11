var express = require('express');
var router = express.Router();
var Schedule = require('../models/Schedule')
var User = require("../models/User");

function checkLogin(req, res, next) {
    if (!req.session.user_id || !req.session.user_name) {
        return res.sendStatus(401);
    }
    next();
}

function isValideSchedule(schedule) {
    return true;
}

router.post("/", checkLogin);
router.post('/', function (req, res, next) {
    req.body.user_id =req.session.user_id;
    if (!isValideSchedule(req.body)) {
        res.sendStatus(400);
    }
    var newSchedule = new Schedule(req.body);
    newSchedule.create(function (err) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        else{
            res.status(201).json({schedule : newSchedule.toDict()});
        }
    });
});

router.delete("/:schedule_id", checkLogin);
router.delete('/:schedule_id', function (req, res, next) {
    Schedule.removeByID(req.params.schedule_id, function (err) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            res.sendStatus(204);
        }
    });
});


router.put('/:schedule_id',checkLogin);
router.put('/:schedule_id', function (req, res, next) {
    req.body.schedule_id = req.params.schedule_id;
    req.body.user_id = req.session.user_id;

    if (!isValideSchedule(req.body)) {
        res.sendStatus(400);
    }

    var updateSchedule = new Schedule(req.body);
    updateSchedule.update(function (err) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            res.json({schedule:updateSchedule.toDict()});
        }
    });
});


module.exports = router;