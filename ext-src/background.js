// var iTemp = 0

// function updateBadge(){	
//     //chrome.browserAction.setBadgeText ( { text: iTemp+"" } );
//     iTemp++;
// }

chrome.alarms.clearAll()
loadDatesFromStorage(false);

chrome.alarms.create("main",{periodInMinutes: 0.1});
chrome.alarms.onAlarm.addListener(function(alarm) {
	loadDatesFromStorage(false);	
});