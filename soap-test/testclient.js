
var soap = require('soap');
var url = "http://127.0.0.1:3000/wsdl?wsdl";
var queryDateTime = new Date(2016,11,11);
var args = {user:{userName: "y2k", queryDateTime:queryDateTime.toISOString()}};

soap.createClient(url, function(err, client) {
	client.getSchedules(args, function(err, result) {
		console.log(client.lastRequest);
		console.log(client.lastResponse);
		console.log(result)
		if (result) {
			console.log(result.schedule);
		}
	});
});