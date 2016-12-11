

var soap = require('soap');
var req_url = "http://127.0.0.1:3000/wsdl?wsdl";

function accessBySoap(name, date, callback) {
	var queryDateTime = date;
	var args = {user:{name: "y2k", queryDateTime:queryDateTime.toISOString()}};
	soap.createClient(req_url, function(err, client) {

		client.getSchedules(args, function(err, result) {
			// console.log(err);
			// console.log(client);
			// console.log(client.lastResponse);
			// console.log(result)
			// if (result) {
			// 	console.log(result.schedule);
			// }
		});
	});
}

module.exports = accessBySoap;