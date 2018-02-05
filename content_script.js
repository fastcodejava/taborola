var jsonObj = {};
//jsonObj["current"] = "search";
	//jsonObj["description"] = "google search";
var sites = [];
var queryString = "";
var hrefAdded = [];

function refreshObj() {
	chrome.storage.local.get('googleSearch', function(searchResult){
		console.log("result orig-" + JSON.stringify(searchResult));
		if (searchResult.googleSearch) {
			jsonObj = searchResult.googleSearch;
		}
		
		if (location.origin.indexOf('cnn') > -1) {
			queryString = "";
			//cnn
			var urlBase = location.origin;
			console.log(urlBase);
			$("div.cd__content").find("h3 > a").each(function (index) {
			  console.log("Title: " + this.text);
			  console.log($(this));
			  //$(this).append("<br><span style='color: orange'>My new line text</span>");
			  console.log('me done');
			  var obj = {};
			  //var urlBase = location.origin;
			  //console.log(urlBase);
			  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
				  console.log("not in hrefadded array");
				 // var partialUrl = $(this).attr('href');
				 //var fullUrl = urlBase + partialUrl;
				  //console.log(fullUrl);
				obj[this.text] = location.origin + $(this).attr('href');
				sites.push(obj);
			  }
				
			});
			//jsonObj['cnn'] = sites;
			var newObj = {};
			newObj["current"] = location.origin;
			newObj["tree"] = false;
			newObj["sites"] = sites; //[newEntryObj];
			jsonObj['cnn'] = newObj;
			/*console.log("Final object...\n" + JSON.stringify(jsonObj));
			console.log("queryStr--" + queryString);
			//chrome.storage.local.set({'googleSearch': "", 'queryString' : "", 'searchEngine' : ""}, function() {});
			chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
				console.log('Settings saved');
			});*/
		} else if (location.origin.indexOf('google') > -1) {
			//refreshObj();
			queryString = document.getElementsByName("q")[0].value;
			
			//google
			$("div#rso > div._NId:first").find("div.g").find("div.rc").find("h3 > a").each(function (index) {
			  console.log("Title: " + this.text);
			  console.log($(this));
			  //$(this).append("<br><span style='color: orange'>My new line text</span>");
			  console.log('me done');
			  var obj = {};
			  
				obj[this.text] = $(this).attr('href');
				sites.push(obj);
				hrefAdded.push($(this).attr('href'));
			  
			  
			});

			$("div#rso").find("div > g-section-with-header").find("h3").find("a").each(function (index) {
			  console.log("Title: " + this.text);
			  console.log($(this));
			  //$(this).append("<br><span style='color: orange'>My new line text</span>");
			  console.log('me done');
			  var obj = {};
			  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
				obj[this.text] = $(this).attr('href');
				sites.push(obj);
			  }
			  
				
			});

			$("div.srg").find("h3 > a").each(function (index) {
			  console.log("Title: " + this.text);
			  console.log($(this));
			  //$(this).append("<br><span style='color: orange'>My new line text</span>");
			  console.log('me done');
			  var obj = {};
			  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
				obj[this.text] = $(this).attr('href');
				sites.push(obj);
			  }
				
			});
			console.log("Orig object...\n" + JSON.stringify(jsonObj));
			//jsonObj['google'] = sites;
			var newObj = {};
			newObj["current"] = location.origin;
			newObj["tree"] = false;
			newObj["sites"] = sites; //[newEntryObj];
			jsonObj['google'] = newObj;
			console.log("Final object...\n" + JSON.stringify(jsonObj));
			/*console.log("Final object...\n" + JSON.stringify(jsonObj));
			console.log("queryStr--" + queryString);
			chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
				console.log('Settings saved');
			});*/
			sites = [];
		} else if (location.origin.indexOf('bing') > -1){
			//refreshObj();
			queryString = document.getElementsByName("q")[0].value;
			//bing //ol.b_results
				
			$("ol#b_results > li.b_algo").find("h2 > a").each(function () {
				console.log("Title: " + this.text);
				var lnk = $(this).attr('href');
			  console.log("from: " + JSON.stringify(lnk));
				 var obj = {};
			  obj[this.text] = $(this).attr('href');
			  sites.push(obj);
			});
			//jsonObj['bing'] = sites;
			var newObj = {};
			newObj["current"] = location.origin;
			newObj["tree"] = false;
			newObj["sites"] = sites; //[newEntryObj];
			jsonObj['bing'] = newObj;
			/*console.log("Final object...\n" + JSON.stringify(jsonObj));
			console.log("queryStr--" + queryString);
			chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
				console.log('Settings saved');
			});*/
			
		} else if (location.origin.indexOf('yahoo') > -1) {
			
			queryString = document.getElementsByName("p")[0].value;
			//yahoo
			$("div#web").find("h3 > a").each(function () {
				console.log("Title: " + this.text);
				var lnk = $(this).attr('href');
			  console.log("from: " + JSON.stringify(lnk));
				 var obj = {};
			  obj[this.text] = $(this).attr('href');
			  sites.push(obj);
			});
			//jsonObj['yahoo'] = sites;
			var newObj = {};
			newObj["current"] = location.origin;
			newObj["tree"] = false;
			newObj["sites"] = sites; //[newEntryObj];
			jsonObj['yahoo'] = newObj;
			/*console.log("Final object...\n" + JSON.stringify(jsonObj));
			console.log("queryStr--" + queryString);
			chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
				console.log('Settings saved');
			});*/
		} else if (location.origin.indexOf('youtube') > -1) {
			
			queryString = document.getElementsByName("search_query")[0].value;
			//youtube //find("ytd-video-renderer")
			$("div#contents").find("h3 > a").each(function (index) {
			  console.log("Title: " + this.text);
			  console.log($(this));
			  //$(this).append("<br><span style='color: orange'>My new line text</span>");
			  console.log('me done');
			  var obj = {};
			  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
				obj[this.text] = location.origin + $(this).attr('href');
				sites.push(obj);
			  }
			  
				//div#title-wrapper
			});
			console.log("Orig object...\n" + JSON.stringify(jsonObj));
			//jsonObj['youtube'] = sites;
			var newObj = {};
			newObj["current"] = location.origin;
			newObj["tree"] = false;
			newObj["sites"] = sites; //[newEntryObj];
			jsonObj['youtube'] = newObj;
			console.log("Final object...\n" + JSON.stringify(jsonObj));
			/*console.log("Final object...\n" + JSON.stringify(jsonObj));
			console.log("queryStr--" + queryString);
			chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
				console.log('Settings saved');
			});*/
		} else if (location.origin.indexOf('stackoverflow') > -1) {
			var groupedObj = {};
			if (document.getElementsByName("q")) {
				queryString = document.getElementsByName("q")[0].value;
			}
			//stackoverflow
			var urlBase = location.origin;
			console.log(urlBase);
			if (queryString === "") {
				$("div.summary").find("h3 > a").each(function (index) {
					console.log("Title: " + this.text);
				    console.log($(this));
				    //$(this).append("<br><span style='color: orange'>My new line text</span>");
				    console.log('me done');
				    var obj = {};
				    //var urlBase = location.origin;
				    //console.log(urlBase);
				    if (hrefAdded.indexOf($(this).attr('href')) === -1) {
					    console.log("not in hrefadded array");
					    // var partialUrl = $(this).attr('href');
					    //var fullUrl = urlBase + partialUrl;
					    //console.log(fullUrl);
					    obj[this.text] = location.origin + $(this).attr('href');
						//var subItems=[];
						
						$(this).parent().next().find("a").each (function (){
							var subItems = groupedObj[this.text];
							if (subItems && subItems.length > 0) {
								subItems.push(obj);
							} else {
								subItems = [];
								subItems.push(obj);
							}
							groupedObj[this.text] = subItems;
							
						});
						
					    //sites.push(obj);
				    }
					
				});
			} else {
				$("div.result-link").find("span > a").each(function (index) {
					console.log("Title: " + this.text);
				    console.log($(this));
				    //$(this).append("<br><span style='color: orange'>My new line text</span>");
				    console.log('me done');
				    var obj = {};
				    //var urlBase = location.origin;
				    //console.log(urlBase);
				    if (hrefAdded.indexOf($(this).attr('href')) === -1) {
					    console.log("not in hrefadded array");
					    // var partialUrl = $(this).attr('href');
					    //var fullUrl = urlBase + partialUrl;
					    //console.log(fullUrl);
					    obj[this.text] = location.origin + $(this).attr('href');
					    sites.push(obj);
				    }
					
				});
			}
			
			//jsonObj['stackoverflow'] = sites;
			var newObj = {};
			newObj["current"] = location.origin;
			newObj["tree"] = true;
			newObj["sites"] = groupedObj; //sites; //[newEntryObj];
			jsonObj['stackoverflow'] = newObj;
			/*console.log("Final object...\n" + JSON.stringify(jsonObj));
			console.log("queryStr--" + queryString);
			//chrome.storage.local.set({'googleSearch': "", 'queryString' : "", 'searchEngine' : ""}, function() {});
			chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
				console.log('Settings saved');
			});*/
		} else if (location.origin.indexOf('washingtonpost') > -1) {
			
			
			//washingtonpost
			$("div.headline").find("a").each(function (index) {
			  console.log("Title: " + this.text);
			  console.log($(this));
			  //$(this).append("<br><span style='color: orange'>My new line text</span>");
			  console.log('me done');
			  var obj = {};
			  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
				obj[this.text] =  $(this).attr('href');
				sites.push(obj);
			  }
			  
				//div#title-wrapper
			});
			
			console.log("Orig object...\n" + JSON.stringify(jsonObj));
			var newObj = {};
			newObj["current"] = location.origin;
			newObj["tree"] = false;
			newObj["sites"] = sites; //[newEntryObj];
			jsonObj['washingtonpost'] = newObj;
			//jsonObj['washingtonpost'] = sites;
			console.log("Final object...\n" + JSON.stringify(jsonObj));
			
		}
		console.log("Final object...\n" + JSON.stringify(jsonObj));
		console.log("queryStr--" + queryString);
		chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
			console.log('Settings saved');
		});
		sites = [];
	});

	//console.log("obj new-" + JSON.stringify(jsonObj));
}

	
	
	
	
	
window.addEventListener ("load", myMain, false);

function myMain (evt) {
	//refreshObj();

	
	/*if (location.origin.indexOf('cnn') > -1) {
		refreshObj();
		queryString = "";
		//cnn
		var urlBase = location.origin;
		console.log(urlBase);
		$("div.cd__content").find("h3 > a").each(function (index) {
		  console.log("Title: " + this.text);
		  console.log($(this));
		  //$(this).append("<br><span style='color: orange'>My new line text</span>");
		  console.log('me done');
		  var obj = {};
		  //var urlBase = location.origin;
		  //console.log(urlBase);
		  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
			  console.log("not in hrefadded array");
			 // var partialUrl = $(this).attr('href');
			 //var fullUrl = urlBase + partialUrl;
			  //console.log(fullUrl);
			obj[this.text] = location.origin + $(this).attr('href');
			sites.push(obj);
		  }
			
		});
		jsonObj['cnn'] = sites;
		console.log("Final object...\n" + JSON.stringify(jsonObj));
		console.log("queryStr--" + queryString);
		//chrome.storage.local.set({'googleSearch': "", 'queryString' : "", 'searchEngine' : ""}, function() {});
		chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
			console.log('Settings saved');
		});
	}*/
	
	

		

	
	
	//chrome.runtime.sendMessage({cnnLoading: "complete"});
	/*chrome.storage.local.set({'cnnLoading': "complete"}, function() {
		console.log('Cnn loading complete..');
	});*/
}




/*	

if (location.origin.indexOf('yahoo') > -1) {
	refreshObj();
	queryString = document.getElementsByName("p")[0].value;
	//yahoo
	$("div#web").find("h3 > a").each(function () {
		console.log("Title: " + this.text);
		var lnk = $(this).attr('href');
	  console.log("from: " + JSON.stringify(lnk));
		 var obj = {};
	  obj[this.text] = $(this).attr('href');
	  sites.push(obj);
	});
	jsonObj['yahoo'] = sites;
	console.log("Final object...\n" + JSON.stringify(jsonObj));
	console.log("queryStr--" + queryString);
	chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
		console.log('Settings saved');
	});
} else if (location.origin.indexOf('youtube') > -1) {
	refreshObj();
	queryString = document.getElementsByName("search_query")[0].value;
	//youtube //find("ytd-video-renderer")
	$("div#contents").find("h3 > a").each(function (index) {
	  console.log("Title: " + this.text);
	  console.log($(this));
	  //$(this).append("<br><span style='color: orange'>My new line text</span>");
	  console.log('me done');
	  var obj = {};
	  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
		obj[this.text] = location.origin + $(this).attr('href');
		sites.push(obj);
	  }
	  
		//div#title-wrapper
	});
	jsonObj['youtube'] = sites;
	console.log("Final object...\n" + JSON.stringify(jsonObj));
	console.log("queryStr--" + queryString);
	chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
		console.log('Settings saved');
	});
} else if (location.origin.indexOf('cnn') > -1) {
	queryString = "";
} else if (location.origin.indexOf('google') > -1) {
	refreshObj();
	queryString = document.getElementsByName("q")[0].value;
	
	//google
	$("div#rso > div._NId:first").find("div.g").find("div.rc").find("h3 > a").each(function (index) {
	  console.log("Title: " + this.text);
	  console.log($(this));
	  //$(this).append("<br><span style='color: orange'>My new line text</span>");
	  console.log('me done');
	  var obj = {};
	  
		obj[this.text] = $(this).attr('href');
		sites.push(obj);
		hrefAdded.push($(this).attr('href'));
	  
	  
	});

	$("div#rso").find("div > g-section-with-header").find("h3").find("a").each(function (index) {
	  console.log("Title: " + this.text);
	  console.log($(this));
	  //$(this).append("<br><span style='color: orange'>My new line text</span>");
	  console.log('me done');
	  var obj = {};
	  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
		obj[this.text] = $(this).attr('href');
		sites.push(obj);
	  }
	  
		
	});

	$("div.srg").find("h3 > a").each(function (index) {
	  console.log("Title: " + this.text);
	  console.log($(this));
	  //$(this).append("<br><span style='color: orange'>My new line text</span>");
	  console.log('me done');
	  var obj = {};
	  if (hrefAdded.indexOf($(this).attr('href')) === -1) {
		obj[this.text] = $(this).attr('href');
		sites.push(obj);
	  }
		
	});
	jsonObj['google'] = sites;
	console.log("Final object...\n" + JSON.stringify(jsonObj));
	console.log("queryStr--" + queryString);
	chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
		console.log('Settings saved');
	});
} else if (location.origin.indexOf('bing') > -1){
	refreshObj();
	queryString = document.getElementsByName("q")[0].value;
	//bing //ol.b_results
		
	$("ol#b_results > li.b_algo").find("h2 > a").each(function () {
		console.log("Title: " + this.text);
		var lnk = $(this).attr('href');
	  console.log("from: " + JSON.stringify(lnk));
		 var obj = {};
	  obj[this.text] = $(this).attr('href');
	  sites.push(obj);
	});
	jsonObj['bing'] = sites;
	console.log("Final object...\n" + JSON.stringify(jsonObj));
	console.log("queryStr--" + queryString);
	chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
		console.log('Settings saved');
	});
	
}*/
//var queryString = document.getElementsByName("q")[0].value; //"p" for yahoo
/*console.log("jjjjj" + queryString);
console.log(location.pathname);
console.log(location.href);
console.log(location.host);
console.log(location.hostname);
console.log(location.pathname);
console.log(location.origin);*/
//var urlquery = '';
//urlquery = location.origin + location.pathname + '?q=' + queryString;
/*if (location.origin.indexOf('cnn') === -1) {
	jsonObj['cnn'] = sites;
	console.log("Final object...\n" + JSON.stringify(jsonObj));
	console.log("queryStr--" + queryString);
	chrome.storage.local.set({'googleSearch': jsonObj, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
		console.log('Settings saved');
	});
}*/

var fromGS = {};
$("div.srg").find("h3 > a").click(function () {
	fromGS = $(this).attr('href');
  console.log("from: " + JSON.stringify(fromGS));
  	
});

$('a').click(function(){
	
	//alert('u r going to ' + $(this).attr('href') + '..jst li dt..');
});

var urlArr = [];//[id^="yui_"]
$('a').each(function(index){
	//urlArr.push($(this).attr('href'));
	//alert('u r going to ' + $(this).attr('href') + '..jst li dt..');
	//console.log('u r going to ' + $(this).attr('href') + '..jst li dt..' );
	//console.log( $(this));
});
//console.log("showing..\n" + urlArr);



chrome.runtime.onMessage.addListener(function(req, sender, sendres){
	if (req.exec) {
		refreshObj();
		return;
	}
	
	//console.log("in lsner lll" + location.origin);
	 /*if (request.greeting == "hello")*/
    var url = new URL(location.origin);
	var name = url.hostname.split('.')[1];
	//if (req.highlight) {
		//alert(req.selectedItems);
		
		//console.log("in lsner" + req.selectedItems);
		
		if (name === 'google') {
			highlightTextG(req.selectedItems, req.highlight);
		} else if (name === 'yahoo') {
			highlightTextY(req.selectedItems, req.highlight);
		} else if (name === 'bing') {
			highlightTextB(req.selectedItems, req.highlight);
		} else if (name === 'youtube') {
			highlightTextYT(req.selectedItems, req.highlight);
		}
	
});

function highlightTextG(selectedItems, highlight) {
	
	//console.log("in highlight");
	//$("div.srg").find("h3 > a").each(function (index) {
	$("div#rso > div._NId:first").find("div.g").find("div.rc").find("h3 > a").each(function (index) {
		//console.log("in first search.." + selectedItems);
		//console.log("in first search.." + $(this).attr('href'));
		 if(selectedItems === $(this).attr('href')) {
			if (highlight) {
				//console.log("going to highlight,,,");
				$(this.parentNode.nextSibling).css("background-color","#E2DDDD");
			} else {
				//console.log("going to de highlight,,,");
				$(this.parentNode.nextSibling).css("background-color","");
			}
			
			//console.log($(this));
			//console.log($(this.parentNode.nextSibling));
		}		
	});

	$("div#rso").find("div > g-section-with-header").find("h3").find("a").each(function (index) {
		//console.log("in 2nd search..");
	    if(selectedItems === $(this).attr('href')) {
			if (highlight) {
				$("div#rso").find("div > g-section-with-header").css("background-color","#E2DDDD");
				
				//$(this.parentNode.nextSibling).css("background-color","#E2DDDD");
			} else {
				$("div#rso").find("div > g-section-with-header").css("background-color","");
			}
			
			//console.log($(this));
			//console.log($("div#rso").find("div > g-section-with-header > g-scrolling-carousel"));
		}
		
	});
	$("div.srg").find("h3 > a").each(function (index) {
		//console.log("in 3rd search..");
		if(selectedItems === $(this).attr('href')) {
			if (highlight) {
				$(this.parentNode.nextSibling).css("background-color","#E2DDDD");
			} else {
				$(this.parentNode.nextSibling).css("background-color","");
			}
			
			//console.log($(this));
			//console.log($(this.parentNode.nextSibling));
		}
	});
}


function highlightTextY(selectedItems, highlight) {
	
	//console.log("in highlight");
	$("div#web").find("h3 > a").each(function () {
		if(selectedItems === $(this).attr('href')) {
			if (highlight) {
				$(this.parentNode.parentNode.nextSibling.nextSibling).css("background-color","#E2DDDD");
			} else {
				$(this.parentNode.parentNode.nextSibling.nextSibling).css("background-color","");
			}
			//console.log($(this));
			//console.log($(this.parentNode.parentNode.nextSibling.nextSibling));
		}
		
	});
	
}

function highlightTextB(selectedItems, highlight) {
	
	//console.log("in highlight");
	$("ol#b_results > li.b_algo").find("h2 > a").each(function () {
		if(selectedItems === $(this).attr('href')) {
			//console.log($(this));
			//console.log($(this.parentNode.nextSibling));
			if (highlight) {
				$(this.parentNode.parentNode).find("div.b_caption").css("background-color","#E2DDDD");
			} else {
				$(this.parentNode.parentNode).find("div.b_caption").css("background-color","");
			}
			
		}
		
	});
	
}

function highlightTextYT(selectedItems, highlight) {
	
	//console.log("in highlight" + selectedItems);
	$("div#contents").find("ytd-video-renderer").find("h3 > a").each(function (index) {
		//console.log($(this).attr('href'));
		if(selectedItems.indexOf($(this).attr('href')) > -1) {
			//console.log($(this));
			//console.log($(this.parentNode.nextSibling));
			//console.log($(this.parentNode.parentNode));
			if (highlight) {
				$(this.parentNode.parentNode).css("background-color","#E2DDDD");
			} else {
				$(this.parentNode.parentNode).css("background-color","");
			}
			
		}
		
	});
	
}