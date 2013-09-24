//global vars 
var heightProgress = 80;
var heightSettings = 212;
var animateTime = 200;
var gsStartDate = "" 
var gsFinishDate = ""



function valToStr(val){
	var sVal = "";
	if(val < 1 || isNaN(val)){
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

function loadDatesFromStorage(renderOff) {
	var sStartDate = ""
	var sFinishDate = ""
	var bStartDateIsLoaded = false;
	var bFinishDateIsLoaded = false;
	chrome.storage.local.get('startDate', function(r) {
	        sStartDate = r['startDate'];
	        gsStartDate = sStartDate
	        bStartDateIsLoaded = true;

	        if(bStartDateIsLoaded && bFinishDateIsLoaded){
	        	calculateDate(sStartDate,sFinishDate,true,renderOff);
	    	}
	});
	chrome.storage.local.get('finishDate', function(r) {
	        sFinishDate = r['finishDate'];
	        gsFinishDate = sFinishDate
	        bFinishDateIsLoaded = true;

	        if(bStartDateIsLoaded && bFinishDateIsLoaded){
	        	calculateDate(sStartDate,sFinishDate,true,renderOff);
	    	}
	});	
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


function dateWasChanged(start,finish) {	
	chrome.storage.local.set({startDate:start, finishDate:finish}, function() {});
	gsStartDate = start;
	gsFinishDate = finish;
}

function calculateDate(sStartDate,sFinishDate,animationOff,renderOff) {	

	console.log("s",">"+sStartDate+"<","f",">"+sFinishDate+"<")	
	if( sStartDate == "NaN/NaN/NaN" ||  sFinishDate == "NaN/NaN/NaN"){
		sStartDate  = "";
		sFinishDate = "";
	}

	var now    = unixTime();
	var start  = unixTime(sStartDate);
	var finish = unixTime(sFinishDate);
	var val = Math.round( 100 - ((finish-now) * 100 / (finish-start)) );// val = 99;
	var daysLeft = Math.round( (finish-now)/(60*60*24) )	
	var badgeText = daysLeft+""
	if( sStartDate == undefined || sFinishDate == undefined || sStartDate == "" || sFinishDate == "" || daysLeft < 0 ){
		daysLeft = 0;	
		badgeText = "";
	}	
	chrome.browserAction.setBadgeText ( { text: badgeText } );
    var startCur = new Date(gsStartDate);
    var finishCur = new Date(gsFinishDate);

	if(!renderOff){
		renderPopUp(val,daysLeft,startCur,finishCur,sStartDate,sFinishDate,animationOff);	
	}
}