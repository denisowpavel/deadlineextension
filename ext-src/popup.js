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

function loadDatesFromStorage() {
	var sStartDate = ""
	var sFinishDate = ""
	var bStartDateIsLoaded = false;
	var bFinishDateIsLoaded = false;
	chrome.storage.local.get('startDate', function(r) {
	        sStartDate = r['startDate'];
	        gsStartDate = sStartDate
	        bStartDateIsLoaded = true;

	        if(bStartDateIsLoaded && bFinishDateIsLoaded){
	        	calculateDate(sStartDate,sFinishDate,true);
	    	}
	});
	chrome.storage.local.get('finishDate', function(r) {
	        sFinishDate = r['finishDate'];
	        gsFinishDate = sFinishDate
	        bFinishDateIsLoaded = true;

	        if(bStartDateIsLoaded && bFinishDateIsLoaded){
	        	calculateDate(sStartDate,sFinishDate,true);
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

function calculateDate(sStartDate,sFinishDate,animationOff) {	
	console.log("s",">"+sStartDate+"<","f",">"+sFinishDate+"<")	

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
	chrome.browserAction.setBadgeText ( { text: badgeText } );
    var startCur = new Date(gsStartDate);
    var finishCur = new Date(gsFinishDate);

	//val daysLeft startCur finishCur
	renderPopUp(val,daysLeft,startCur,finishCur,sStartDate,sFinishDate,animationOff);
}

function renderPopUp(val,daysLeft,startCur,finishCur,sStartDate,sFinishDate,animationOff) {		
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
	
	$("div#comment,div#title").css("color", textColor);
	$("div#comment").html(daysLeft+" days left");
	$("body").css("background-color","#555")

   	$("div#dateRrange").datepicker({ 
   						beforeShowDay: function ( date ) {   							
							return [true, ( (date.getTime() >= Math.min(startCur, finishCur) && date.getTime() <= Math.max(startCur, finishCur)) ? 'date-range-selected' : '')];
						},
			            onSelect: function ( dateText, inst ) {
			                  var d1, d2;
			                  startCur = finishCur;
			                  finishCur = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
			                  if ( startCur == -1 || startCur == finishCur ) {
			                     startCur = finishCur;
			                     $('#jrange input').val( dateText );
			                  } else {
			                     d1 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.min(startCur,finishCur)), {} );
			                     d2 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.max(startCur,finishCur)), {} );
			                     $('#jrange input').val( d1+' - '+d2 );
			                  }
			                  if(d1 && d1){
			                  	dateWasChanged(d1, d2);
			                  }
			               },
    })

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

	var bgScript = chrome.extension.getBackgroundPage()	 
	if (bgScript != null){
		bgScript.updateBadge();
	}

	loadDatesFromStorage();
	//	
	$("div#settingsPanel").height(heightSettings);
	$("img#infoBtnBg").hide();
	$("img#infoBtn").mouseover(function () {$("img#infoBtnBg").show();})
	$("img#infoBtn").mouseout(function () {$("img#infoBtnBg").hide();})
	$("img#infoBtn").click(goToSettings);
	$("button#doneBtn").button().click(function () { 		
 		calculateDate(gsStartDate,gsFinishDate,false);
 	});

});
