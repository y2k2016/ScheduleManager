function getElementById(el){ return document.getElementById(el);}

function getXMLHTTP () {
	var xmlhttp;
	if(window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	else if(window.ActiveXObject) {
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	else {
		alert('browser version is too low');
		return false;
	}
	return xmlhttp; 
}

function requests(req_url, method, req_mess, callback) {
	var xmlhttp = getXMLHTTP();
	if(!xmlhttp) {
		return callback(new Error("could not get xmlhttp instance"));
	}
	xmlhttp.open(method, req_url, true);
	xmlhttp.setRequestHeader("Content-type", "application/json");
	xmlhttp.onreadystatechange = function () {
		if(xmlhttp.readyState === 4) {
			if (xmlhttp.status === 401) {
				window.location = "/login";
			}
			else if (xmlhttp.status === 500) {
				showWrongDiv();
			}
			else if (xmlhttp.status == 204) {
				callback();
			}
			else if(xmlhttp.status >= 200 && xmlhttp.status < 300) {
				try {
					var renderMessage = JSON.parse(xmlhttp.responseText);
				} catch (err) {
					var renderMessage = {};
				}
				callback(undefined, renderMessage);
			}
			else if (xmlhttp.status === 404) {
				showWrongDiv("404 Not Found!!");
			}
			else{
				showWrongDiv();
			}
		}
	}
	if (!req_mess) {
		return xmlhttp.send();
	}
	if (!(req_mess instanceof String)) {
		req_mess = JSON.stringify(req_mess);
	}
	xmlhttp.send(req_mess);
}


function showWrongDiv(message) {
	var e = getElementById("wrong_div");
	if (message) {
		e.innerText = message;
	}
	else {
		e.innerText = "Something wrong! Please try again!"
	}
	e.style.display = "";
	window.setTimeout(function(){
		e.style.display = "none";
	}, 3000);
}


function calendar(){
	this._MODULE_ID_ = '';//日历实例的唯一标识ID
	this.dayArray = [31,28,31,30,31,30,31,31,30,31,30,31];
	this.currentDate = {year:null,month:null};//当前页日期的年份和月份
	this.cache = {
		selectedDates : {},//选择的日期
		currentDateStrings : []//当前页的日期id集合
	};
	//可配置的属性列表
	this.properties = {
		dayNames : ['S','M','T','W','T','F','S'],
		monthNames : ['January','February','March','April','May','June',
		'July','August','September','October','November','December'],
		startTime : new Date(2008,0,23),//日历开始日期
		endTime : new Date(2008,4,20),//日历结束日期
		holder : 'calendar',//日历所在的div容器id
		callback : null,//日期选择以后的回调函数
		callback_prev_month:null,
		callback_next_month:null,
		isMultipleSelect:false,//是否可以多选
		dateNormalColor : '#FFF',
		dateHoverColor : '#FFFFCC',
		headerClass : 'header',
		currentDateClass : 'currentDate',
		weekdaysClass : 'weekdays',
		contentClass : 'content',
		prevMonthClass : 'prevMonth',
		prevMonthActiveClass : 'prevMonthActive',
		nextMonthClass : 'nextMonth',
		nextMonthActiveClass : 'nextMonthActive',
		isDateClass : 'isDate',
		isTodayClass : 'isToday',
		isDoubleDayClass : 'isDoubleDay',
		isTripleDayClass : "isTripleDay",
		isScheduledClass : "isScheduled",
		isSelectedClass : 'isSelected'
	};
}
calendar.prototype = {
	//是否是闰年
	isLeapYear:function(year){
		return ( year % 4 == 0 && year % 100 != 0) || ( year % 400 == 0 );
	},
	//是否是开始日期
	isStartMonth:function(){
		return this.isSameDate(
			new Date(this.currentDate.year,this.currentDate.month,1),
			new Date(this.properties.startTime.getFullYear(),this.properties.startTime.getMonth(),1)
		);
	},
	//是否是结束日期
	isEndMonth:function(){
		return this.isSameDate(
			new Date(this.currentDate.year,this.currentDate.month,1),
			new Date(this.properties.endTime.getFullYear(),this.properties.endTime.getMonth(),1)
		);
	},
	//是否是已选择日期
	isSelectedDay:function(date){
		return this.cache.selectedDates[this.dateToString(date)] == true ? true : false;
	},
	//是否是今天
	isToday:function(date){
		return this.isSameDate(date,new Date());
	},
	isScheduled:function(date){

		if(!this.properties.schedules) {
			return false;
		}
		for (var i = this.properties.schedules.length - 1; i >= 0; i--) {
			if(this.isSameDate(date, this.properties.schedules[i].start_date)) {
				return true;
			}
		}

		return false;
	},
	//是否是相同日期
	isSameDate:function(a,b){
		return a.getFullYear()  == b.getFullYear() 
				&& a.getMonth() == b.getMonth() 
				&& a.getDate()  == b.getDate();
	},
	//变量是否是函数，该函数从jquery-1.2.1.js中拷贝
	isFunction:function( fn ) {
        return !!fn && typeof fn != "string" && !fn.nodeName &&
            fn.constructor != Array && /function/i.test( fn + "" );
    },
	//设置当前日期this.currentDate，如果当前为闰年则修正this.dayArray中二月份的天数
	setcurrentDate:function(year,month){
		this.dayArray[1] = this.isLeapYear(year) ?  29 : 28;
		this.currentDate.year = year;
		this.currentDate.month = month;
	},
	//设置实例的唯一标识ID
	setMoudleId:function(){
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for(var i = 0 ; i < 32; i++)
			this._MODULE_ID_ += chars.charAt(Math.floor(Math.random()*62));
	},
	//根据TD和它的id选取日期
	//首先设置该TD的className改变其外观，然后在this.cache.selectedDates中增加该日期.
	selectDate:function(element,elementId){
		if(this.properties.isMultipleSelect){
			if(this.cache.selectedDates[elementId] == undefined){
				element.className = this.properties.isSelectedClass;
				this.cache.selectedDates[elementId] = true;
			}
			else 
				this.deleteSelect(element,elementId);
		}
		else {
			for(var i in this.cache.selectedDates)
				this.deleteSelect($(i+this._MODULE_ID_),i);
			// element.className = this.properties.isSelectedClass;
			this.cache.selectedDates[elementId] = true;
		}
		if(this.properties.callback!=null && this.isFunction(this.properties.callback)){
			this.properties.callback(this);
		}
	},
	//根据TD和它的id删除日期选取
	deleteSelect:function(element,elementId){
		delete this.cache.selectedDates[elementId];
		if(element == null) return;//单选时如果不在当前页，将找不到该对象，只用删除缓存中的时间；
		if(this.isToday(this.stringToDate(elementId)))
			element.className = this.properties.isTodayClass;
		else
			element.className = this.properties.isDateClass;
	},
	//修正当前单数的月份为两位，例如'8'->'08'
	digitFix:function(number,count){
		var _string = number+"";
		var _count = count-_string.length;
		for(var i = 0; i < _count; i++)
			_string = "0" + _string;
		return _string;
	},
	//转换日期成字符串，例如2008年8月31日转换成'20080831'
	dateToString:function(date){
		return date.getFullYear()+this.digitFix(date.getMonth()+1,2)+this.digitFix(date.getDate(),2);
	},
	//转换字符串成日期，例如20080831转换成'2008年8月31日'
	stringToDate:function(string){
		return new Date(
			parseInt(string.substring(0,4)),
			string.substring(4,5) == '0' ? parseInt(string.substring(5,6))-1 : parseInt(string.substring(4,6))-1,
			string.substring(6,7) == '0' ? parseInt(string.substring(7)) : parseInt(string.substring(6))
		);
	},
	//显示下一月的日期
	setNextMonth:function(){
		if(this.isEndMonth()) return;
		if(this.currentDate.month > 10){
			this.currentDate.month = 0;
			this.currentDate.year++;
		}
		else this.currentDate.month++;
	},
	//显示上一月的日期
	setPrevMonth:function(){
		if(this.isStartMonth()) return;
		if(this.currentDate.month < 1){
			this.currentDate.month = 11;
			this.currentDate.year--;
		}
		else this.currentDate.month--;
	},
	//开始渲染前设置当前日期并清空原this.cache.currentDateStrings中的内容
	preRender:function(year,month){
		this.setcurrentDate(year,month);
		this.cache.currentDateStrings.length = 0;
	},
	//渲染日历的头部
	renderHeader:function(){
		var html = '';
		var prevMonthClass = this.isStartMonth() ? this.properties.prevMonthClass : this.properties.prevMonthActiveClass;
		var nextMonthClass = this.isEndMonth()   ? this.properties.nextMonthClass : this.properties.nextMonthActiveClass;
		html += '<table class="'+this.properties.headerClass+'"><tr><td id="'
			 +this.properties.prevMonthClass+this._MODULE_ID_+'" class="'
			 +prevMonthClass+'">&nbsp;</td><td class="'+this.properties.currentDateClass+'">'
			 +this.properties.monthNames[this.currentDate.month]+'  '
 			 +this.currentDate.year
			 +'</td><td id="'
			 +this.properties.nextMonthClass+this._MODULE_ID_+'" class="'
			 +nextMonthClass+'">&nbsp;</td></tr></table>';
		return html;
	},
	//渲染日期
	renderWeekdays:function(){
		var html = '';
		for(var i in this.properties.dayNames)
			html +=  '<td>'+this.properties.dayNames[i]+'</td>';
		return '<tr class="'+this.properties.weekdaysClass+'">'+html+'</tr>';
	},
	//根据年份和日期呈现日历
	render:function(year,month){
		this.preRender(year,month);
		
		var date = new Date(year,month,1),dateString = '';
		var dayCount = this.dayArray[month];
		var preDayCount = date.getDay(),preDayCounter = preDayCount;
		var afterDayCounter = (this.dayArray[month]+preDayCount)%7 == 0 ? 0 : 7-((this.dayArray[month]+preDayCount)%7);
		
		var html = this.renderHeader()+'<div id="'+this.properties.contentClass+this._MODULE_ID_+'" class="'+this.properties.contentClass+'"><table>';
		html += this.renderWeekdays();
		html += '<tr>';
		
		//先补齐本月日期开始前的TD数
		while(preDayCounter-- > 0) html += '<td>&nbsp;</td>';
		
		for(var i = 1; i <= dayCount; i++ ){
			date = new Date(year,month,i);
			dateString = this.dateToString(date);
			//保存当月的日期
			this.cache.currentDateStrings.push(dateString);
			var day_class = this.properties.isDateClass;
			if (this.isScheduled(date)) {
				day_class += " "+this.properties.isScheduledClass;
			}
			if (this.isSelectedDay(date)) {
				day_class += " "+this.properties.isSelectedClass;
			}
			if (this.isToday(date)) {
				day_class += " "+this.properties.isTodayClass;
			}
			
 			html += '<td class="'+day_class+'" id="'+dateString+this._MODULE_ID_+'">'+i+'</td>';
			//如果满7个TD则换行
			if((i+preDayCount) % 7 == 0) html += '</tr><tr>';
		}
		
		//补齐本月日期结束后的TD数
		while(afterDayCounter-- > 0) html += '<td>&nbsp;</td>';
		
		html += '</tr>';
		html += '</table></div>';
		getElementById(this.properties.holder).innerHTML = html;
		this.attachEvent();
	},
	//为日历中上一月、下一月按钮以及TD绑定相关事件
	attachEvent:function(){
		this.bind(getElementById(this.properties.prevMonthClass+this._MODULE_ID_),'click',this.properties.callback_prev_month,this);
		this.bind(getElementById(this.properties.nextMonthClass+this._MODULE_ID_),'click',this.properties.callback_next_month,this);
		var els = this.cache.currentDateStrings,_el = null;
		for(var i = 0; i < els.length; i++){
			_el = getElementById(els[i]+this._MODULE_ID_);
			this.bind(_el,'click',this.selectDate,this,[_el,els[i]]);
		}
	},
	//内置事件绑定函数
	bind:function(el,type,fn,range,params){
		var _params = params == null || params.constructor != Array  ? [params] : params;
		if (el.addEventListener)
			el.addEventListener(type,function(){fn.apply(range,_params)}, false);
		else
			el.attachEvent("on"+type, function(){fn.apply(range,_params)});
	},
	//日历初始化函数
	init:function(year,month,schedules,holder){
		this.setMoudleId();
		if(year == null && month == null) {
			var _date = new Date();
			year = _date.getFullYear();
			month = _date.getMonth();
		}
		if (schedules!=null) {
			recoverySchedules(schedules);
		}
		else {
			schedules = [];
		}
		if(holder!=null) {
			this.properties.holder = holder;
		}
		this.properties.schedules = schedules;
		this.render(year,month);
	}
}

calendar.prototype.updateDaySchedule = function(date) {

	var schedules = this.properties.schedules;

	var day_schedules = [];

	for (var i = 0; i < schedules.length; i++) {
		if(this.isSameDate(date, schedules[i].start_date)) {
			day_schedules[day_schedules.length] = schedules[i];
		}
	}
	var html = this.generateDaySchedulesHTML(day_schedules, generateFree, generateBusy);

	getElementById("day_schedule").innerHTML = '<button class="col-md-12 btn time-head-div">schedule</button>'+html;
	document.getElementById("select_date").innerHTML = formatDateToDate(date);
}

calendar.prototype.deleteSchedule = function(schedule_id) {
	var temp_date = null;
	for (var i = 0; i < this.properties.schedules.length; i++) {
		if (schedule_id == this.properties.schedules[i].schedule_id) {
			temp_date = this.properties.schedules.splice(i, 1)[0].start_date;
			break;
		}
	}
	this.render(this.currentDate.year, this.currentDate.month);
	if (temp_date != null) {
		this.updateDaySchedule(temp_date);
	}
}
calendar.prototype.updateSchedule = function(schedule_id, title, description, start_date, end_date) {
	for (var i = 0; i < this.properties.schedules.length; i++) {
		if (schedule_id == this.properties.schedules[i].schedule_id) {
			this.properties.schedules[i].title = title;
			this.properties.schedules[i].description = description;
			this.properties.schedules[i].start_date = start_date;
			this.properties.schedules[i].end_date = end_date;
			break;
		}
	}
	this.updateDaySchedule(start_date);

}

calendar.prototype.generateDaySchedulesHTML = function(day_schedules, generateFreeHTML, generateBusyHTML) {
	day_schedules.sort(function(a, b){return a.start_date.getTime()-b.start_date.getTime();});

	var heights = [];
	for (var i = 0; i < day_schedules.length; i++) {
		var start_hour = day_schedules[i].start_date.getHours();
		var start_minu = day_schedules[i].start_date.getMinutes();
		var end_hour = day_schedules[i].end_date.getHours();
		var end_minu = day_schedules[i].end_date.getMinutes();
		heights[heights.length] = [start_hour*30+start_minu/2, (end_hour-start_hour)*30+(end_minu-start_minu)/2];
	}
	var height_index = 0;
	var html = "";
	for (var i = 0; i < heights.length; i++) {
		var empty = heights[i][0] - height_index;
		var fill = heights[i][1];
		html += generateFreeHTML(empty) + generateBusyHTML(fill, day_schedules[i]);
		height_index = heights[i][0] + heights[i][1];
	}
	if (height_index < 24*30) {
		html += generateFreeHTML(24*30-height_index);
	}
	return html;
}

calendar.prototype.showFriendDaySchedules = function(schedules) {
	recoverySchedules(schedules);

	getElementById("day_schedule").className = "col-md-5";

	var html = this.generateDaySchedulesHTML(schedules, generateFree, generateFriendBusy)
	var frident_el = getElementById("friend_day_schedule");
	frident_el.style.display="";
	frident_el.innerHTML = '<button type="button" class="col-md-12 btn time-head-div" onclick="hideFriendDaySchedules()">friend schedule<span class="badge">click to hide</span></button>'+html;
}

function generateFree(height) {
	if (height==0) {return "";}
	return '<button type="button" class="btn btn-default col-md-12" style="height:'+height+'px"></button>';
}

function generateBusy(height, schedule) {
	if (height==0) {
		return "";
	}
	var html = '<button type="button" class="btn btn-primary col-md-12" data-toggle="modal" data-target="#'+schedule.schedule_id+
				'" style="height:'+height+'px">'+
  				formatDateToTime(schedule.start_date)+
  				"-"+
  				formatDateToTime(schedule.end_date)+
  				" "+
  				schedule.title+
  				'</button><div class="modal fade" id="'+schedule.schedule_id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
		'<div class="modal-dialog">'+
		  '<div class="modal-content">'+
			'<div class="modal-header">'+
			  '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
			  '<h4 class="modal-title" id="myModalLabel">Schedule</h4>'+
			'</div>'+
			'<div class="modal-body">'+
			'<label>Title</label>'+
			'<input type="text" class="form-control" id="'+schedule.schedule_id+'title" value="'+schedule.title+'">'+
			'<label>Description</label>'+
			'<textarea class="form-control" id="'+schedule.schedule_id+'description">'+schedule.description+'</textarea>'+
			'<label>Start</label>'+
			'<input type="time" class="form-control" id="'+schedule.schedule_id+'start_time" value="'+formatDateToTime(schedule.start_date)+'">'+
			'<label>End</label>'+
			'<input type="time" class="form-control" id="'+schedule.schedule_id+'end_time" value="'+formatDateToTime(schedule.end_date)+'">'+
			'</div>'+
			'<div class="modal-footer">'+
			  '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="deleteByScheduleID(\''+schedule.schedule_id+'\')">Delete</a>'+
			  '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="updateSchedule(\''+schedule.schedule_id+'\')">Save changes</button>'+
			'</div>'+
		  '</div>'+
		'</div>'+
	'</div>';
	return html	
}

function generateFriendBusy(height, schedule) {
	if (height==0) {return "";}
	return '<button type="button" class="btn btn-primary col-md-12" style="height:'+height+'px">'+
			formatDateToTime(schedule.start_date)+
			"-"+
			formatDateToTime(schedule.end_date)+
			'</button>';
}

function recoverySchedules(schedules) {
	if (!schedules || !(schedules instanceof Array)) {
		return;
	}
	for (var i = 0; i < schedules.length; i++) {
		schedules[i].start_date = new Date(schedules[i].start_date);
		schedules[i].end_date = new Date(schedules[i].end_date);
	}
}


function formatDateToDate(date) {
	var year = date.getFullYear().toString();
	var month = (date.getMonth()+1).toString();
	var day = date.getDate().toString();
	return year+"-"+month+"-"+day;
}

function formatDateToTime(date) {
	var hour = date.getHours().toString();
	var minu = date.getMinutes().toString();
	if (hour < 10) {
		hour = "0"+hour;
	}
	if (minu < 10) {
		minu = "0" + minu;
	}
	return hour+":"+minu;
}

function hideFriendDaySchedules() {
	getElementById("day_schedule").className = "col-md-10";
	getElementById("friend_day_schedule").style.display="none";
}

function updateSchedule(schedule_id) {
	var req_url = '/schedule/'+schedule_id;

	var title = getElementById(schedule_id+"title").value;
	var description = getElementById(schedule_id+"description").value;
	var start_time = getElementById(schedule_id+"start_time").value;
	var end_time = getElementById(schedule_id+"end_time").value;

	var select_date = new Date(getElementById("select_date").innerText);
	var start_date = new Date(formatDateToDate(select_date)+" " +start_time);
	var end_date = new Date(formatDateToDate(select_date) + " " + end_time);

	if (title.trim() == '' || end_date.getTime() <= start_date.getTime()) {
		return alert("Please check your inputs!")
	}

	var req_mess = {title:title, description:description, start_date:start_date, end_date:end_date};
	requests(req_url, "put", req_mess, function(err, renderMessage) {
		if (err) {
			//to-do
			return;
		}
		ecT.updateSchedule(schedule_id, title, description, start_date, end_date);
	});
}


function createSchedule() {
	var req_url = '/schedule';

	var title = getElementById("new_schedule_title").value;
	var description = getElementById("new_schedule_description").value;
	var start_time = getElementById("new_schedule_start_time").value;
	var end_time = getElementById("new_schedule_end_time").value;

	var select_date = new Date(getElementById("select_date").innerText);
	var start_date = new Date(formatDateToDate(select_date)+" " +start_time);
	var end_date = new Date(formatDateToDate(select_date) + " " + end_time);

	if (title.trim() == '' || end_date.getTime() <= start_date.getTime()) {
		return alert("Please check your inputs!")
	}

	var req_mess = {title:title, description:description, start_date:start_date, end_date:end_date};
	requests(req_url, "post", req_mess, function(err, renderMessage) {
		if (err) {
			// to-do
			return;
		}
		var new_schedule_id = renderMessage.schedule.schedule_id;
		var new_schedule_user_id = renderMessage.schedule.user_id;
		ecT.properties.schedules[ecT.properties.schedules.length] = {schedule_id:new_schedule_id,user_id:new_schedule_user_id,title:title,description:description,start_date:start_date,end_date:end_date};
		ecT.updateDaySchedule(start_date);
		ecT.render(ecT.currentDate.year, ecT.currentDate.month);
	});
}
function deleteByScheduleID(schedule_id) {
	var req_url = '/schedule/'+schedule_id;
	requests(req_url, "delete", null, function(err) {
		if (err) {
			// to-do
			return;
		}
		ecT.deleteSchedule(schedule_id);
	});
}

function updateCalendar() {
	var req_url = '/';
	var req_mess = {year:ecT.currentDate.year, month:ecT.currentDate.month};

	requests(req_url, "post", req_mess, function(err, renderMessage) {
		if (err) {
			//to-do
			return;
		}
		ecT.init(renderMessage.year, renderMessage.month, renderMessage.schedules, "calendar");
	});
}

function findFriendSchedules() {
	var req_url = '/friend';
	var systemType = getElementById("systemType").value;
	var serviceType = getElementById("serviceType").value;
	var friend_name = getElementById("friend_name").value;
	if (friend_name.trim() == "") {
		return alert("Please enter name!");
	}
	var date = new Date(getElementById("select_date").innerHTML);
	var req_mess = {systemType:systemType, serviceType:serviceType, friend_name:friend_name, date:date};

	requests(req_url, "post", req_mess, function(err, renderMessage) {
		if (err) {
			//to-do
			return;
		}
		ecT.showFriendDaySchedules(renderMessage.schedules);;
	});
}




var ecT = new calendar();
ecT.properties.dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
ecT.properties.isMultipleSelect = false;

ecT.properties.callback = function(cal){
	
	for(var i in cal.cache.selectedDates){
		if(cal.cache.selectedDates[i] == true){
			var selectedDate = ecT.stringToDate(i);
			ecT.updateDaySchedule(selectedDate);

		}
	}
};
ecT.properties.callback_prev_month = function() {
	this.setPrevMonth();
	if (getElementById("user_name") == null) {
		this.render(this.currentDate.year, this.currentDate.month);
	}
	else {
		updateCalendar();
	}
}
ecT.properties.callback_next_month = function() {
	this.setNextMonth();
	if (getElementById("user_name") == null) {
		this.render(this.currentDate.year, this.currentDate.month);
	}
	else {
		updateCalendar();
	}
}