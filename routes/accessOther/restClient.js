var setting = {
    host: '127.0.0.1',
    port: '1337',
    cookie: 'connect.sid=s%3AUqUvhIiGgchXfOq-8sp0oABmVcGr8sSg.jasGWm%2FfPSuhrIEupvBGaFSpkCv6jpvYkX2TD0Vym4g',
    name: 'admin',
    password: '123456'
}

var Client = require('node-rest-client').Client;

var client = new Client();
var req_url = 'http://' + setting.host + ':' + setting.port + '/users/${name}/schedules?start_date=${start_date}&end_date=${end_date}';

//request:
//  url: 	http://host:port/users/:username/schedules
// 	method: GET
// 	params: {start_date : "2016-07-07T00:00:0Z", end_date : "2016-12-21T00:00:0Z"}


function accessByRest(user_name, query_date, callback) {
    var year = query_date.getFullYear();
    var month = query_date.getMonth();
    var day = query_date.getDate();
    var sd = new Date(year, month, day);
    var ed = new Date(sd.getTime()+24*60*1000);

    var args = {
        path: { "name": user_name, "start_date": sd.toJSON(), "end_date": ed.toJSON() },
        headers: { "Cookie": setting.cookie }
    };

    client.get(req_url, args, function(data, response){
        if (!data) {
            return callback(new Error("no data"));
        }
        if (data.result != 0) {
            // to-do
            return callback(new Error("data.result:0"));
        }
        if (!(data.schedules instanceof Array) || isNaN(parseInt(data.span))) {
            return callback(new Error("funny"));
        }
        var mess_schedules = []
        
        for (var i = 0; i < data.schedules.length; i++) {
            var start_date = new Date(data.schedules[i].date);
            if (isNaN(start_date.getTime())) {
                return callback(new Error("he"));
            }
            var end_date = new Date(start_date.getTime()+data.span*60*1000);
            mess_schedules[i] = {start_date:start_date, end_date:end_date};
        }
        callback(undefined, mess_schedules);
    });
}

module.exports = accessByRest;
