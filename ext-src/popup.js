var heightProgress = 80;
var heightSettings = 395;
var animateTime = 200;

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

function goToSettings(animationOff) {
	var localAnimateTime = animateTime;
	if(animationOff == true ){
		localAnimateTime = 0;
	}
    $("div#deadlinePanel").animate({
	    'opacity':0.7,
		'margin-top': (-1 * heightProgress)
	},localAnimateTime);	
	$("html").animate({'height':heightSettings},localAnimateTime);
	$("img#infoBtnBg").hide();
}

function goToProgress() {
    $("div#deadlinePanel").animate({
	    'opacity':1,
		'margin-top': 0
	},animateTime);	
	$("html").animate({'height':heightProgress},animateTime);
}

$(document).ready(function() {

	var now    = unixTime();
	var start  = unixTime("07/14/2013");
	var finish = unixTime("07/22/2013");
	var val = Math.round( 100 - ((finish-now) * 100 / (finish-start)) );// val = 99;
	var daysLeft = Math.round( (finish-now)/(60*60*24) )	
	var badgeText = daysLeft+""
	if( daysLeft < 0 ){
		daysLeft = 0;	
		badgeText = "";
	}	
	var bgColor = "#FFF";
	var textColor = "#555";
	if(val >= 85){
		bgColor = "#000";
		textColor = "#FFF";
		$("img#infoBtn").attr("src","img/info-w.png");
	}
	$("div#deadlinePanel").css("background-color", bgColor);
	$("img#progress").attr("src","img/progress0"+valToStr(val)+".png");
	
	$("div#comment").css("color", textColor);
	$("div#comment").html(daysLeft+" days left");
	///chrome.browserAction.setBadgeText ( { text: badgeText } );

	
	
	$("div#startDate").datepicker();
	$("div#finishDate").datepicker();


	goToSettings(true);
	$("div#settingsPanel").height(heightSettings);
	$("img#infoBtnBg").hide();
	$("img#infoBtn").mouseover(function () {$("img#infoBtnBg").show();})
	$("img#infoBtn").mouseout(function () {$("img#infoBtnBg").hide();})
	$("img#infoBtn").click(goToSettings);
	$("button#doneBtn").button().click(function () {
 		goToProgress();
 	});
	
});
