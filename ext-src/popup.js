$(document).ready(function() {
	var val = 130;	
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
	
	$("img#progress").attr("src","img/progress0"+sVal+".png");
});
