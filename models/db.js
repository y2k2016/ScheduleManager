
var orm = require("orm");
var settings = require("../settings");
var util = require("util");
var dbURL = util.format("mysql://%s:%s@%s/%s", settings.user, settings.password, settings.host, settings.db)

module.exports = orm.connect(dbURL);;
