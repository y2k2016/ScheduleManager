
function Utils() {}

Utils.isString = function(s) {
	return (s instanceof String) || typeof(s) === "string";
}

Utils.isSameDate = function(a,b){
    return a.getFullYear()  == b.getFullYear() 
            && a.getMonth() == b.getMonth() 
            && a.getDate()  == b.getDate();
}

module.exports = Utils;