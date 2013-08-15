var iTemp = 0

function updateBadge(){	
    //chrome.browserAction.setBadgeText ( { text: iTemp+"" } );
    iTemp++;
}

chrome.alarms.clearAll()
updateBadge();

chrome.alarms.create("main",{periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(function(alarm) {
	updateBadge();  	
});