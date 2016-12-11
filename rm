


// request:
// 		url: 	http://127.0.0.1:3000/api
// 		method: post
// 		params: {user_name : "y2k", query_date : "2016-12-11T07:45:03.718Z"}

// response:
// 		httpcode:500   error
// 			  	 404   not found
// 			  	 200   {schedules : [
// 			  						{start_date:"2016-12-11T07:45:03.718Z", end_date:"2016-12-11T07:45:03.718Z"},
// 			  						{start_date:"2016-12-11T07:45:03.718Z", end_date:"2016-12-11T07:45:03.718Z"},
// 			  						{start_date:"2016-12-11T07:45:03.718Z", end_date:"2016-12-11T07:45:03.718Z"}
// 			  					    ]
// 			  		   }






// var soap = require('soap');
// var url = "http://127.0.0.1:3000/wsdl?wsdl";
// var queryDateTime = new Date(2016,11,11);
// var args = {user:{userName: "y2k", queryDateTime:queryDateTime.toISOString()}};

// soap.createClient(url, function(err, client) {
// 	client.getSchedules(args, function(err, result) {
// 		console.log(client.lastRequest);
// 		console.log(client.lastResponse);
// 		console.log(result)
// 		if (result) {
// 			console.log(result.schedule);
// 		}
// 	});
// });

// <?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://www.schedule.com/wsdl/ScheduleService.wsdl"><soap:Body><getSchedules><user><userName>y2k</userName><queryDateTime>2016-12-10T16:00:00.000Z</queryDateTime></user></getSchedules></soap:Body></soap:Envelope>
// <?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:tns="http://www.schedule.com/wsdl/ScheduleService.wsdl"><soap:Body><getSchedulesResponse><schedule><startDateTime>2016-12-10T17:00:00.000Z</startDateTime><endDateTime>2016-12-10T18:00:00.000Z</endDateTime></schedule><schedule><startDateTime>2016-12-11T03:00:00.000Z</startDateTime><endDateTime>2016-12-11T06:00:00.000Z</endDateTime></schedule></getSchedulesResponse></soap:Body></soap:Envelope>
// { schedule: 
//    [ { startDateTime: Sun Dec 11 2016 01:00:00 GMT+0800 (中国标准时间),
//        endDateTime: Sun Dec 11 2016 02:00:00 GMT+0800 (中国标准时间) },
//      { startDateTime: Sun Dec 11 2016 11:00:00 GMT+0800 (中国标准时间),
//        endDateTime: Sun Dec 11 2016 14:00:00 GMT+0800 (中国标准时间) } ] }
// [ { startDateTime: Sun Dec 11 2016 01:00:00 GMT+0800 (中国标准时间),
//     endDateTime: Sun Dec 11 2016 02:00:00 GMT+0800 (中国标准时间) },
//   { startDateTime: Sun Dec 11 2016 11:00:00 GMT+0800 (中国标准时间),
//     endDateTime: Sun Dec 11 2016 14:00:00 GMT+0800 (中国标准时间) } ]