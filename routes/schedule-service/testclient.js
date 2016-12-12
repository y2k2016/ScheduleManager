
var soap = require('soap');
var url = "http://127.0.0.1:3000/wsdl?wsdl";
var queryDateTime = new Date(2016,11,11);
var args = {user:{userName:"y2k",queryDateTime:queryDateTime.toJSON()}};

soap.createClient(url, function(err, client) {
	client.getSchedules(args, function(err, result) {
		if (err) {
			//do something 
			return;
		}
		if (!result || !result.schedule) {
			// no any schedule
			return;
		}
		console.log(result)
	});
});

var queryDateTime = new Date(2016,11,11);
var request = require("request");
var url = "http://127.0.0.1:3000/api"
request.post({url:url, form:{user_name : "y2k", query_date : queryDateTime.toJSON()}}, function(err, res, body) {
	console.log(body)
})