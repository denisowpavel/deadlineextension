

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
			                  		if(startCur == "Invalid Date" && finishCur>0){
			                  			startCur = new Date();
			                  		}
			                     	d1 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.min(startCur,finishCur)), {} );
			                     	d2 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.max(startCur,finishCur)), {} );			                     	
			                     	$('#jrange input').val( d1+' - '+d2 );
			                  }
			                  if(d1 && d1){
			                  	dateWasChanged(d1, d2);
			                  }
			               },
    })

	if(sFinishDate!=undefined && sFinishDate!=""){
		goToProgress(animationOff);
	}else{		
		goToSettings(animationOff);	
	}

}
$(document).ready(function() {
	//debug clean local storage
	//chrome.storage.local.remove("startDate", function() {console.log("Start Date Was Removed")});
	//chrome.storage.local.remove("finishDate", function() {console.log("Finish Date Was Removed")});

	

	// var bgScript = chrome.extension.getBackgroundPage()	 
	// if (bgScript != null){
	// 	bgScript.updateBadge();
	// }

	loadDatesFromStorage(false);
	//	
	$("div#settingsPanel").height(heightSettings);
	$("img#infoBtnBg").hide();
	$("img#infoBtn").mouseover(function () {$("img#infoBtnBg").show();})
	$("img#infoBtn").mouseout(function () {$("img#infoBtnBg").hide();})
	$("img#infoBtn").click(goToSettings);
	$("button#doneBtn").button().click(function () { 		
 		calculateDate(gsStartDate,gsFinishDate,false,false);
 	});

});
