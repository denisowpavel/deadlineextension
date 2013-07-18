//global vars 
var heightProgress = 80;
var heightSettings = 395;
var animateTime = 200;
var gsStartDate = "" 
var gsFinishDate = ""

//http://www.benknowscode.com/2012/11/selecting-ranges-jquery-ui-datepicker.html

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
		gsStartDate = date;
	}	
	if(picker.id == "finishDate"){
		chrome.storage.local.set({finishDate:date}, function() {});
		gsFinishDate = date;
	}	
}

function renderPopUp(sStartDate,sFinishDate,animationOff) {	
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
	var infoBtnSrc = "img/info-b.png"
	if(val >= 85){
		bgColor = "#000";
		textColor = "#FFF";		
		infoBtnSrc = "img/info-w.png"
	}	
	$("img#infoBtn").attr("src",infoBtnSrc);
	$("div#deadlinePanel").css("background-color", bgColor);
	$("img#progress").attr("src","img/progress0"+valToStr(val)+".png");
	
	$("div#comment").css("color", textColor);
	$("div#comment").html(daysLeft+" days left");
	///chrome.browserAction.setBadgeText ( { text: badgeText } );


	$("body").css("background-color","#555")
	$("div#startDate").datepicker({onSelect: dateWasChanged}).datepicker('setDate', gsStartDate);
	$("div#finishDate").datepicker({onSelect: dateWasChanged}).datepicker('setDate', gsFinishDate);

	if(sStartDate!="" && sFinishDate!=""){
		goToProgress(animationOff);
	}else{
		goToSettings(animationOff);	
	}

}
$(document).ready(function() {
	//debug clean local storage
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
	        	renderPopUp(sStartDate,sFinishDate,true);
	    	}
	});
	chrome.storage.local.get('finishDate', function(r) {
	        sFinishDate = r['finishDate'];
	        bFinishDateIsLoaded = true;

	        if(bStartDateIsLoaded && bFinishDateIsLoaded){
	        	renderPopUp(sStartDate,sFinishDate,true);
	    	}
	});



	//	
	$("div#settingsPanel").height(heightSettings);
	$("img#infoBtnBg").hide();
	$("img#infoBtn").mouseover(function () {$("img#infoBtnBg").show();})
	$("img#infoBtn").mouseout(function () {$("img#infoBtnBg").hide();})
	$("img#infoBtn").click(goToSettings);
	$("button#doneBtn").button().click(function () { 		
 		renderPopUp(gsStartDate,gsFinishDate,false);
 	});

});
