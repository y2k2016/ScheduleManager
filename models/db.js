
var orm = require("orm");
var settings = require("../settings");
var util = require("util");
var dbURL = util.format("%s://%s:%s@%s/%s", settings.protocol, settings.user, settings.password, settings.host, settings.database)


module.exports = orm.connect(dbURL);;
