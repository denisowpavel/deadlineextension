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
	$("div#settingsPanel").show();
    $("div#deadlinePanel").animate({
	    'opacity':0.7,
		'margin-top': (-1 * heightProgress)
	},localAnimateTime);	
	$("html").animate({'height':heightSettings},localAnimateTime);
	$("img#infoBtnBg").hide();
}

function goToProgress(animationOff) {	
	var localAnimateTime = animateTime;
	if(animationOff == true ){
		localAnimateTime = 0;
	}
    $("div#deadlinePanel").animate({
	    'opacity':1,
		'margin-top': 0
	},localAnimateTime);	
	$("html").animate({'height':heightProgress},localAnimateTime,function(){$("div#settingsPanel").hide()});
}

function dateWasChanged(date,picker) {	
	//to be refactoring
	if(picker.id == "startDate"){
		chrome.storage.local.set({startDate:date}, function() {});
	}	
	if(picker.id == "finishDate"){
		chrome.storage.local.set({finishDate:date}, function() {});
	}	
}

function renderPopUp(sStartDate,sFinishDate) {	
	console.log("s",sStartDate,"f",sFinishDate)	
	// sStartDate = "07/14/2013"
	// sFinishDate = "07/22/2013"

	var now    = unixTime();
	var start  = unixTime(sStartDate);
	var finish = unixTime(sFinishDate);
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

	
	//
	$("div#startDate").datepicker({onSelect: dateWasChanged}).datepicker('setDate', sStartDate);
	$("div#finishDate").datepicker({onSelect: dateWasChanged}).datepicker('setDate', sFinishDate);

	//goToProgress(true);
	goToSettings(true);
	$("div#settingsPanel").height(heightSettings);
	$("img#infoBtnBg").hide();
	$("img#infoBtn").mouseover(function () {$("img#infoBtnBg").show();})
	$("img#infoBtn").mouseout(function () {$("img#infoBtnBg").hide();})
	$("img#infoBtn").click(goToSettings);
	$("button#doneBtn").button().click(function () {
 		goToProgress();
 	});
}
$(document).ready(function() {
	//debug
	//chrome.storage.local.set({startDate:""}, function() {});
	//chrome.storage.local.set({finishDate:""}, function() {});

	var sStartDate = ""
	var sFinishDate = ""
	var bStartDateIsLoaded = false;
	var bFinishDateIsLoaded = false;
	chrome.storage.local.get('startDate', function(r) {
	        sStartDate = r['startDate'];
	        bStartDateIsLoaded = true;

	        if(bStartDateIsLoaded && bFinishDateIsLoaded){
	        	renderPopUp(sStartDate,sFinishDate);
	    	}
	});
	chrome.storage.local.get('finishDate', function(r) {
	        sFinishDate = r['finishDate'];
	        bFinishDateIsLoaded = true;

	        if(bStartDateIsLoaded && bFinishDateIsLoaded){
	        	renderPopUp(sStartDate,sFinishDate);
	    	}
	});
	
});
