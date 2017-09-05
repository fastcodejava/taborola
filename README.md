# mypages
This is a chrome extensions that will open users favourite pages, that are already configured, 
based on the current tab.

User has to configure ones favourite web pages in json format.
For example:


		{
	"amazon": {
		"current": "amazon",
		"description": "news sites",
		"sites": {
			"Electronics": [
				{
					"Laptop": "http://www.amazon.in/laptop"
				},
				{
					"Mobile-Phones": "http://www.amazon.in/mobiles"
				},
				{
					"Television": "http://www.amazon.in/TV"
				}
			],
			"Home-default": [
				{
					"Kitchen": "http://www.amazon.in/kitchen"
				},
				{
					"Grocery": "http://www.amazon.in/Gourmet-Specialty-Foods"
				},
				{
					"Furniture": "http://www.amazon.in/furniture"
				}
			]
		}
	},
	"news": {
		"current": "cnn,nyt",
		"description": "news sites",
		"sites": [
			{
				"Regions": "http://edition.cnn.com/regions"
			},
			{
				"Politics": "http://edition.cnn.com/politics"
			},
			{
				"International": "http://money.cnn.com/INTERNATIONAL/"
			},
			{
				"Entertainment": "http://edition.cnn.com/entertainment"
			},
			{
				"Technology": "http://money.cnn.com/technology/"
			},
			"http://edition.cnn.com/style",
			"http://edition.cnn.com/travel",
			"http://edition.cnn.com/videos"
		]
	},
	"yahoo": {
		"current": "yahoo,finance.yahoo.com",
		"description": "news sites",
		"sites": [
			{
				"NASDAQ": {
					"selected": false,
					"url": "https://finance.yahoo.com/chart/^IXIC"
				}
			},
			{
				"NFLX": "https://finance.yahoo.com/chart/NFLX"
			},
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
			},
			{
				"AAOI": "https://finance.yahoo.com/chart/AAOI"
			},
			{
				"PLCE": "https://finance.yahoo.com/chart/PLCE"
			},
			{
				"MYSZ": "https://finance.yahoo.com/chart/MYSZ"
			},
			{
				"HTGM": "https://finance.yahoo.com/chart/HTGM"
			},
			{
				"SNPS": "https://finance.yahoo.com/chart/SNPS"
			},
			{
				"COOL": "https://finance.yahoo.com/chart/COOL"
			},
			{
				"AUPH": "https://finance.yahoo.com/chart/AUPH"
			},
			{
				"TECL": "https://finance.yahoo.com/chart/TECL"
			},
			{
				"AKTX": "https://finance.yahoo.com/chart/AKTX"
			},
			{
				"SLCA": "https://finance.yahoo.com/chart/SLCA"
			},
			{
				"WIX": "https://finance.yahoo.com/chart/WIX"
			}
		]
	}
}
	

		
The name of the website from which the popup is invoked, is matched with the value of "current.

If a match is found, then the site are displayed as a list of items.

If "sites" is an array, the url names(keys) are lsited.
All the url names are selected by default, unless it is mantioned as "selected": false.

If the "sites" is an object, the first level of keys will be displayed as a dropdown.
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

In case there is some trouble and pages are not loading within 60secs, work of the extention is aborted.
The time limit can be configured in the options page. Default is 60secs.

All the tabs with same base url, will be highlighted. This is configurable in the options page.
Option to open tabs in the background can also be configured here.

To do a google/yahoo/bing search in the current website alone, one can enter the text and select a search engine, 
and click on search button.

When doing a search on google, the search result will be available when the extension is invoked.
One can get the list of search result, from any of the search pages.
It is available from google or from any of the search result page.

The same is available for yahoo and bing search.

After search with any one of the engines, one can do the same search again with the other engine,
just by selecting the engine and clicking on the "Search Again" button.


