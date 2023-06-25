chrome.runtime.onInstalled.addListener(function() {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
      return;
    }

    console.log('Token acquired:', token);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    console.log(tab.url);
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = tabs[0].url;
    if (url.includes("mail.google.com")) {  // Check if URL contains "mail.google.com"
      var lastSegment = url.split("/").pop();  // Split the URL by '/' and take the last segment
      console.log(lastSegment);
      
      // Save the last segment (email ID) in chrome.storage.local
      chrome.storage.local.set({'emailId': lastSegment}, function() {
        console.log('Value is set to ' + lastSegment);
      });
    }
  });
});

// save htmly notification
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "HTML stored") {
    chrome.notifications.create({
      type:     'basic',
      iconUrl:  'your_icon.png',
      title:    'Success!',
      message:  'HTML content has been successfully stored.',
      priority: 0});
  }
});

