var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Utils = require("../utils/Utils");

router.post('/', function(req, res, next) {
	var user_name = req.body.user_name;
	var password = req.body.password;
	if (!Utils.isString(user_name) || !Utils.isString(password)) {
		res.render("login", {wrongInfo: "something wrong"});
	}
	var user = {user_name:user_name, password:password};
	User.findByName(user.user_name, function(err, user_find) {
		if (err) {
			// server error
			res.render("login", {wrongInfo:"server error, try again"});
		}
		else if (!user_find) {
			// user name not exist
			res.render("login", {wrongInfo:"user name not exists"});
		}
		else if (user.password != user_find.password) {
			// user password wrong
			res.render("login", {wrongInfo:"password is wrong"});
		}
		else {
			// generate and save session
			req.session.regenerate(function(){
			    req.session.user_id = user_find.user_id;
			    req.session.user_name = user_find.user_name;
			    res.redirect('/');
			}); 
		}
	});
});

module.exports = router;