// Copyright (c) 2017 Gautam Dev. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.browserAction.onClicked.addListener(function(tab) {
	var url = tab.url;

	var start = url.indexOf('http://');
	if (start < 0) {
		start = url.indexOf('https://');
	}
	var ind = url.indexOf('/', start + 10);
	var baseurl = url.substring(start, ind);
	chrome.tabs.create({url: baseurl, selected: false, index: (tab.index + 1)});
	//chrome.tabs.create({url: chrome.extension.getURL(url)});
	chrome.tabs.getCurrent(function(currTab) {
		//console.log(tab.url);
		//chrome.tabs.create({url: baseurl, selected: false});
	});
});
