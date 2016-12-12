

var soap = require('soap');
var req_url = "http://127.0.0.1:3000/wsdl?wsdl";

function accessBySoap(name, date, callback) {
	var queryDateTime = date;
	var args = {user:{name: "y2k", queryDateTime:queryDateTime.toJSON()}};
	soap.createClient(req_url, function(err, client) {

		client.getSchedules(args, function(err, result) {
			if (err) {
				return callback(err);
			}
			callback(undefined, []);
		});
	});
}

module.exports = accessBySoap;