var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Utils = require("../utils/Utils");

function checkLogin(req, res, next) {
	if (!req.session.user_id || !req.session.user_name) {
		return res.render("login", {wrongInfo:null});
	}
	next();
}

router.post("/", function(req, res, next) {
	var user_name = req.body.user_name;
	var password = req.body.password;
	if (!Utils.isString(user_name) || !Utils.isString(password)) {
		res.render("login", {wrongInfo: "something wrong"});
	}
	var user = {user_name:user_name, password:password};
	User.findByName(user.user_name, function(err, result) {
		if (err) {
			res.render("login", {wrongInfo: "server error, try again"});
		}
		else if (result!=null) {
			res.render("login", {wrongInfo: "user name exists"});
		}
		else {
			var user_new = new User(user);
			user_new.create(function(err) {
				if(err) {
					res.render("login", {wrongInfo: "server error, try again"});
				}
				else {
					res.render("login", {wrongInfo:null});
				}
			});
		}
	});
});

router.get('/:user_name', function(req, res, next) {
	var user_name = req.params.user_name;
	User.findByName(user_name, function(err, user) {
		res.send('respond with a resource');
	})
});

router.put("/", checkLogin);
router.put("/", function(req, res, next) {
	var user = {user_id:req.session.user_id, user_name:req.session.user_name,password :req.body.password};
	var user_update = new User(user)
	user_update.update(function(err) {
		if (err) {
			res.redirect("/");
		}
		res.redirect("/logout");
	})
});

module.exports = router;
