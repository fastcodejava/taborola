# mypages
This is a chrome extensions that will open users favourite pages, that are already configured, 
based on the web site that is open int he current tab.


User has to configure ones favourite web pages in json format.
For example:
[sample config json](./config.json)


##Favourite Pages
		
	The name of the website from which the popup is invoked, is matched with the value of `"current"`.
If a match is found, then the site are displayed as a list of items.

[Sample page](./main.png)

	If `"sites"` is an array, the url names(keys) are listed.
All the url names are selected by default, unless it is mantioned as `"selected": false`.

	If the `"sites"` is an object, the first level of keys will be displayed as a dropdown.
The item metioned as default will be selected and the sub items will be displayed as a list of checkboxes.
The on which "default" is specified will be selected on load of the popup page.

[Options](./options.png)

	If the plugin is invoked from https://in.finance.yahoo.com/
"in.finance.yahoo.com" will be matched first, if not found, items under "yahoo" will be displayed.

	If you want to add any new page to the configuration, invoke the popup from that website and click on "add" button.
If the website is already configured, this page will be added under that. Else a new entry is created for this website.
When there is some option selected, the url gets added to that option.

	If only one of the urls is to be opened, one can straight away click on the url itself.
If this page needs to be opened in the same tab, one can select only this url, and select the `"open in same tab"` checkbox.

	This list can be sorted A-Z or Z-A, by clicking the sort icon.
	
	In case there is some trouble and pages are not loading within 60secs, work of the extention is aborted.
The time limit can be configured in the options page. Default is 60secs.

	When multiple urls are seleted for opening, all the urls start loading only after the 1st url 
is completely loaded. One can work in this page untill the rest of the urls are opened.

	All the tabs with same base url, will be highlighted. This is configurable in the options page.
Option to open tabs in the background can also be configured here.

[Options Page] (./options_page.png)

##Search In Specific website

	One can search for something in the current website, through google/yahoo/bing.
Enter the search text in the text box provided, select the engine and click "search" button.

[Search in Site] (./search_in_site.png)

##Search

	When doing a search on google, the search result will be available when the extension is invoked.
One can get the list of search result, from any of the search pages. The same feature is available for yahoo and bing search.

	After search with any one of the engines, one can do the same search again with the other engine,
just by selecting the engine and clicking on the "Search Again" button.

[Search Again] (./search_again.png)


