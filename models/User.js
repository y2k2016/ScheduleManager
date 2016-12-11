
var db = require("./db");
var uuid = require("node-uuid");

function User(user) {
	this.user_id = user.user_id;
	this.user_name = user.user_name;
	this.password = user.password;
	if (this.user_id == undefined) {
		this.user_id = uuid.v1();
	}
}

module.exports = User;

db.on("connect", function(err) {
	if (err) {throw err;}

	UserModel = db.define("user", {
		user_id		: {type: "text", key: true},
		user_name	: String,
		password	: String
	});

	User.prototype.toDict = function() {
		var user = {};
		user.user_id = this.user_id;
		user.user_name = this.user_name;
		user.password = this.password;
		return user;
	}

	User.prototype.create = function(callback) {
		UserModel.create(this.toDict(), function(err, results){
			// to-do ...
			callback(err);
		});
	}

	User.prototype.update = function(callback) {
		var user = this.toDict();
		UserModel.find({user_id : this.user_id}, function(err, users){
			if(err) {
				callback(err);
				return;
			}
			if(users.length != 1) {
				callback(err);
				return;
			}
			users[0].user_name = user.user_name;
			users[0].password = user.password;
			users[0].save(function(err){
				callback(err);
			});
		});
	}

	User.findByName = function(name, callback) {
		UserModel.find({user_name : name}, function(err, users) {
			if (err) {
				callback(err, null);
				return;
			}
			if (users.length != 1) {
				callback(err, null);
				return;
			}
			callback(err, users[0]);
		});
	}
});
