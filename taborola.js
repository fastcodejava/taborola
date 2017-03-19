// Copyright (c) 2017 Gautam Dev. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var URL_DEFS = {
	cnn : {
		pattern: "\d{4}/\d{2}/\d{2}/([a-z]+)",
		value: "$1"
	}
};

chrome.browserAction.onClicked.addListener(function(tab) {
	var url = tab.url;

	var start = url.indexOf('http://');
	if (start < 0) {
		start = url.indexOf('https://');
	}
	chrome.storage.sync.get('tabsBackground', function(items) {

		var ind = url.indexOf('/', start + 10);
		if (ind !== -1) {
			var baseurl = url.substring(start, ind);
			if (baseurl !== url) {
				chrome.tabs.create({url: baseurl, selected: !items.tabsBackground, index: (tab.index + 1)});
			}
		}
	});
	//chrome.tabs.create({url: chrome.extension.getURL(url)});
	//chrome.tabs.getCurrent(function(currTab) {
		//console.log(tab.url);
		//chrome.tabs.create({url: baseurl, selected: false});
	//});
});
