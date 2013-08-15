
chrome.alarms.clearAll()
loadDatesFromStorage(false);

chrome.alarms.create("main",{periodInMinutes: 11});
chrome.alarms.onAlarm.addListener(function(alarm) {
	loadDatesFromStorage(false);	
});