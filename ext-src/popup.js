function valToStr(val){
	var sVal = "";
	if(val < 1){
		val = 1;
	}else if(val > 100){
		val = 100;
	}
	if(val < 10){
		sVal = "00"+val;
	}else if(val < 100){
		sVal = "0"+val;
	}else{
		sVal = val;
	}
	return sVal;
}

function unixTime(sDate) {
	var d;
	if(sDate){
		d = new Date(sDate+" 12:00:00")
	}else{
		d = new Date()
	}
    return d.getTime() / 1000;
}


$(document).ready(function() {
	var now    = unixTime()
	var start  = unixTime("07/15/2013")
	var finish = unixTime("07/22/2013")
	console.log(finish - start,finish - now);
	var val = 101;
	var bgColor = "#FFF";
	var textColor = "#000";
	if(val >= 85){
		bgColor = "#000";
		textColor = "#FFF";
	}
	$("body").css("background-color", bgColor);
	$("img#progress").attr("src","img/progress0"+valToStr(val)+".png");
});
