var soap = require("soap-server");

function getfromdb(name) {
	return ["2016-01-01 12:10:10", "2016-01-01 12:10:20"];
}

function ScheduleService(){}

ScheduleService.prototype.getSchedulesByName = function(user_name) {
	return 1;
};

var soapServer = new soap.SoapServer();
var soapService = soapServer.addService('ScheduleService', new ScheduleService());

soapServer.listen(10024, "127.0.0.1");