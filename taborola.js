// Copyright (c) 2017 Gautam Dev. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var URL_DEFS = {
	cnn : {
		pattern: "\d{4}/\d{2}/\d{2}/([a-z]+)",
		value: "$1"
	}
};

var options = ['tabsBackground', 'highlightTabs'];

chrome.browserAction.onClicked.addListener(function(tab) {
	var url = tab.url;

	var start = url.indexOf('http://');
	if (start < 0) {
		start = url.indexOf('https://');
	}
	var ind = url.indexOf('/', start + 10);
	var baseurl = url.substring(start, ind);

	chrome.storage.sync.get(options, function(items) {

		if (ind !== -1) {
			if (baseurl !== url) {
				chrome.tabs.create({url: baseurl, active: !items.tabsBackground, index: (tab.index + 1)});
			}
			if (items.highlightTabs) {
				chrome.tabs.query({}, function (tabs) {
					var t = [tab.index];
					tabs.forEach(function (tb) {
						if (tb.url.indexOf(baseurl) === 0 && tb.index !== tab.index) {
							t.push(tb.index);
						}
					});
					chrome.tabs.highlight({tabs: t});
				});
			}
		}
	});

    function clickHandler(e) {
        chrome.tabs.executeScript({code : "var selectedPages = 'krish';"},
            function (result) {
                chrome.tabs.executeScript({file : "openSelectedPages.js"}, function(result){});
            });

        window.close();
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('openbtn').addEventListener('click', clickHandler);
    });


    //chrome.tabs.create({url: chrome.extension.getURL(url)});
	//chrome.tabs.getCurrent(function(currTab) {
		//console.log(tab.url);
		//chrome.tabs.create({url: baseurl, selected: false});
	//});
});
