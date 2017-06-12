# mypages
This is a chrome extensions that will open users favourite pages, that are already configured, 
based on the current tab.

User has to configure ones favourite web pages in json format.
For example:


	{
	"cnn": [
		{"Regions": "http://edition.cnn.com/regions"},
		{"Politics": "http://edition.cnn.com/politics"},
		{"selected": false,
		 "International": "http://money.cnn.com/INTERNATIONAL/"},
		{"Entertainment": "http://edition.cnn.com/entertainment"},
		{"Technology": "http://money.cnn.com/technology/"}]
	}
	
	or
	{
	"cnn": [
		"http://edition.cnn.com/regions",
		"http://edition.cnn.com/politics",
		"http://money.cnn.com/INTERNATIONAL/",
		"http://edition.cnn.com/entertainment",
		"http://money.cnn.com/technology/"]
	}
	
	"finance.yahoo.com": [
		{
			"NASDAQ": {
				"selected": false,
				"url": "https://finance.yahoo.com/chart/^IXIC"
			}
		},
		{
			"NFLX": "https://finance.yahoo.com/chart/NFLX"
		}
		]
		
	or
"yahoo": [
		
		{
			"GOOGL": "https://finance.yahoo.com/chart/GOOGL"
		},
		{
			"AAPL": "https://finance.yahoo.com/chart/AAPL"
		},
		{
			"PCLN": "https://finance.yahoo.com/chart/PCLN"
		},
		{
			"FB": "https://finance.yahoo.com/chart/FB"
		},
		{
			"SIRI": "https://finance.yahoo.com/chart/SIRI"
		}]
		
The name of the website from which the popup is invoked, is matched with the names on the 
first level(ex: amazon, cnn etc).

If a match is found and is an array, the url names(keys) are lsited.
All the url names are selected by default, unless it is mantioned as "selected": false.

If the match is an object, the first level of keys will be displayed as a dropdown.
The item metioned as default will be selected and the sub items will be displayed as a list of checkboxes.
The on which "default" is specified will be selected on load of the popup page.

If the plugin is invoked from https://in.finance.yahoo.com/
"in.finance.yahoo.com" will be matched first, if not found, items under "yahoo" will be displayed.

If you want to add the current page to the configuration, click on the add button.
When there is some option selected, the url gets added to that option.

when multiple urls are seleted for opening, all the urls start loading only after the 1st url 
is completely loaded. One can work in this page untill the rest of the urls are opened.

If only one of the urls is to be opened, one can straight away click on the url itself.
If this page needs to be opened in the same tab, one can select only this url, and select the "open in same tab".

All the tabs with same base url, will be highlighted. This is configurable in the options page.
Option to open tabs in the background can also be configured here.














