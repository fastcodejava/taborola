var jsonData;
var currentTab;
var highlightTabs;
var tabsBackground;
var currentUrl;
var invokedWindow;
var selectAll;
var loading;
var googleSearch;
var parentUrl;
var utubeData;
var searchPage;
var queryString;
var searchSites;
var searchEngine;
var baseUrl;
var anonymus;
var newtab;
var loadFrom;
var options = ['tabsBackground', 'highlightTabs', 'jsonData', 'selectAll', 'loading', 'googleSearch', 'parentUrl', 'queryString',  'anonymus']; //'searchEngine',, 'loadFrom'
//var readPage = ['www.google.co.in', 'www.google.com', 'search.yahoo.com', 'www.bing.com', 'www.youtube.com', 'edition.cnn.com'];
var readPage = ['google', 'search.yahoo', 'bing', 'youtube', 'cnn', 'stackoverflow', 'washingtonpost'];

var cnnLoading = "loading";

chrome.storage.sync.get( options, function(items) {
		jsonData = items.jsonData;
		highlightTabs = items.highlightTabs;
		tabsBackground = items.tabsBackground;
		selectAll = items.selectAll;
		loading = items.loading;
		console.log("in sync get" + loading);
		//googleSearch = items.googleSearch;
		//console.log("in sync get search--" + googleSearch);
		parentUrl = items.parentUrl;
		//queryString = items.queryString;
		//searchSites = items.searchSites;
		//searchEngine = items.searchEngine;
		anonymus =  items.anonymus;
		//loadFrom = items.loadFrom;
});

chrome.storage.local.get( options, function(items) {
		googleSearch = items.googleSearch;
		console.log("in sync get search--" + googleSearch);
		queryString = items.queryString;
		// searchEngine = items.searchEngine;
});

function closeWindow (e) {
	const allUrls = document.getElementsByName("link");
	var parentNode;
	allUrls.forEach (function (url) {
			console.log(url.parentNode);
			var itemValue = url.value;
			if (searchPage) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {highlight:false, selectedItems: itemValue}, function(response) {
					  console.log(response.farewell);
					}); 
				});
			}
			
		});
		
	
	window.close();
}


function clickHandler(e) {
	//loading = true;
	document.getElementById("openbtn").disabled = true;
	const allUrls = document.getElementsByName("link");
	const urlsToOpen = [];
	const tabToHilite = [currentTab.index];
	const openAt = currentTab.index + 1;
	var anonymusValues;
	try {
		if (allUrls.length === 0) {
			console.log("link undefined " + allUrls);
			anonymusValues = document.getElementById("anonymus").value;
			const urls = anonymusValues.split('\n');
			urls.forEach(function (url) {
				if (url.startsWith('http') || url.startsWith('https')) {
					urlsToOpen.push(url);
				} else {
					throw new Error("The url " + url + " does not have protocol  " + "..Please specify and try again");
					//return ;
				}
				
			});
		} else {
			allUrls.forEach (function (url) {
				console.log(url);
				if (url.checked) {
					urlsToOpen.push(url.value);
					console.log("came till here");
					/*chrome.tabs.create({url: url.value, active : !tabsBackground, index: openAt}, function(tab){
						tabToHilite.push(tab.index);
						openAt ++;
					});*/
					var itemValue = url.value;
					if (searchPage) {
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
							chrome.tabs.sendMessage(tabs[0].id, {highlight:false, selectedItems: itemValue}, function(response) {
							  console.log(response.farewell);
							}); 
						});
					}
					
				} else {
					console.log("came till here in else");
				}
			});
		}
	} catch (err) {
		document.getElementById("error").innerHTML = err.message;
		return;
	}
	
	
	console.log(urlsToOpen);
	/*if (highlightTabs) { 
		chrome.tabs.highlight({tabs: tabToHilite}, function(){});
	}*/
	
	chrome.storage.sync.set({urlsToOpen: [], currTab : "", invokedWindow : "", opnSmeTb : "", loading: false}, function() {});
	var opnSmeTab = document.getElementById("sametabChkbx").checked;
	chrome.storage.sync.set({urlsToOpen: urlsToOpen, currTab: currentTab, invokedWindow: invokedWindow, opnSmeTb: opnSmeTab, loading: true, anonymus : anonymusValues}, function() {
		if (chrome.runtime.error) {
		  console.log("Runtime error.");
		}
	});
	window.close();
}

function selectall () {
	const allUrls = document.getElementsByName("link");
	var parentNode = allUrls[0].parentNode.parentNode.childNodes;
	if (document.getElementById('selectall').checked) {
		allUrls.forEach (function (url) {
			if (currentUrl !== url.value) {
				url.checked = true;
				url.nextSibling.nextSibling.style.fontWeight = "bold";
				document.getElementById("openbtn").disabled = false;
				document.getElementById("sametab").disabled = true;
				document.getElementById("sametabChkbx").checked = false;				
			}
			
			console.log("kkkkkk-" + url.value);
			var itemValue = url.value;
			if (searchPage) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {highlight:true, selectedItems: itemValue}, function(response) {
					  console.log(response.farewell);
					}); 
				});
			}
			
		});
		
		/*
		var howmany = document.getElementById("howmany");
		var selNums = howManyChecked(parentNode);
		howmany.textContent = selNums + " selected.";
		if (selNums > 0) {
			if (document.getElementById('searchAgain')) {
				document.getElementById('searchAgain').disabled = true;
			}
			
			if (document.getElementById('searchbtn')) {
				document.getElementById('searchbtn').disabled = true;
				document.getElementById('searchTextBox').disabled = true;
			}
			document.getElementsByName('site')[0].disabled = true;
			document.getElementsByName('site')[1].disabled = true;
			document.getElementsByName('site')[2].disabled = true; 
		}*/
	} else {
		allUrls.forEach (function (url) {
			url.checked = false;
			console.log(url.parentNode);
			url.nextSibling.nextSibling.style.fontWeight = "normal";
			document.getElementById("openbtn").disabled = true;
			document.getElementById("sametab").disabled = true;
			document.getElementById("sametabChkbx").checked = false;
			var itemValue = url.value;
			if (searchPage) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {highlight:false, selectedItems: itemValue}, function(response) {
					  console.log(response.farewell);
					}); 
				});
			}
			
		});
		/*var howmany = document.getElementById("howmany");
		howmany.textContent = "0 selected.";
		if (document.getElementById('searchAgain')) {
			document.getElementById('searchAgain').disabled = false;
		}
		
		if (document.getElementById('searchbtn')) {
			document.getElementById('searchbtn').disabled = false;
			document.getElementById('searchTextBox').disabled = false;
		}
		document.getElementsByName('site')[0].disabled = false;
		document.getElementsByName('site')[1].disabled = false;
		document.getElementsByName('site')[2].disabled = false; */
		//document.getElementById('searchAgain').disabled = false;
	}
	
	changeSelection(parentNode);
}

function linkClick () {
	console.log(this.href);
	const opnSmeTab = document.getElementById("sametabChkbx").checked;
	chrome.storage.sync.set({urlsToOpen: [], currTab : "", invokedWindow : "", opnSmeTb : "", loading: false}, function() {});
	chrome.storage.sync.set({urlsToOpen: this.href, currTab: currentTab, invokedWindow: invokedWindow, opnSmeTb: opnSmeTab, loading : true}, function() {
		if (chrome.runtime.error) {
		  console.log("Runtime error.");
		}
	});
	window.close();
}

function chkBoxClick (ele) {
	console.log(this.labels[0].innerHTML);
	var currNode = this;
	var none = true;
	var selectedArray = [];
	if (this.checked) {
		this.labels[0].style.fontWeight = "bold";
		document.getElementById("openbtn").disabled = false;
		//var liList = this.parentNode.parentNode.childNodes;
		//console.log(liList.length);
		
		this.parentNode.parentNode.childNodes.forEach(function (li){
			if (currNode !== li.childNodes[0] && li.childNodes[0].checked) {
				none = false;
				return;
			}
			
		});
		if (none) {
			console.log("only one");
			document.getElementById("sametab").disabled = false;
			document.getElementById("sametabChkbx").checked = true;
		} else {
			document.getElementById("sametab").disabled = true;
			document.getElementById("sametabChkbx").checked = false;
		}
		
		console.log("li value-" + this.value);
		/*selectedArray.push(this.value);
		this.parentNode.parentNode.childNodes.forEach(function (li){
			if (currNode !== li.childNodes[0] && li.childNodes[0].checked) {
				selectedArray.push(li.childNodes[0].value);
			}
		});*/
		var itemValue = this.value;
		if (searchPage) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {highlight:true, selectedItems: itemValue}, function(response) {
				  console.log(response.farewell);
				}); 
			});
		}
		
		if (document.getElementById('searchAgain')) {
			document.getElementById('searchAgain').disabled = true;
		}
		
		if (document.getElementById('searchbtn')) {
			document.getElementById('searchbtn').disabled = true;
			document.getElementById('searchTextBox').disabled = true;
		}
		document.getElementsByName('site')[0].disabled = true;
		document.getElementsByName('site')[1].disabled = true;
		document.getElementsByName('site')[2].disabled = true;
		//document.getElementById('searchAgain').disabled = true;
	} else {
		this.labels[0].style.fontWeight="normal";
		document.getElementById("openbtn").disabled = true;
		document.getElementById("sametab").disabled = true;
		document.getElementById("sametabChkbx").checked = false;
		if (atleastOneChecked(this.parentNode.parentNode.childNodes)) {
			document.getElementById("openbtn").disabled = false;
		}
		if (moreThanOneChecked(this.parentNode.parentNode.childNodes)) {
			console.log("more than one checked");
			document.getElementById("sametab").disabled = true;
			document.getElementById("sametabChkbx").checked = false;
		} else {
			document.getElementById("sametab").disabled = false;
			document.getElementById("sametabChkbx").checked = true;
		}
		
		var selItems = this.value;
		if (searchPage) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {highlight:false, selectedItems: selItems}, function(response) {
				  console.log(response.farewell);
				}); 
			});
		}
		
	}
	changeSelection(this.parentNode.parentNode.childNodes);
	//console.log("len--" + this.parentNode.parentNode.childNodes.length);
}

function changeSelection (listNodes) {
	
	var howmany = document.getElementById("howmany");
	var selNums = howManyChecked(listNodes);
	console.log(listNodes.length + "***" + selNums);
	howmany.textContent = selNums + " selected.";
	if (selNums === 0) {
		if (document.getElementById('searchAgain')) {
			document.getElementById('searchAgain').disabled = false;
		}
		
		if (document.getElementById('searchbtn')) {
			document.getElementById('searchbtn').disabled = false;
			document.getElementById('searchTextBox').disabled = false;
		}
		document.getElementsByName('site')[0].disabled = false;
		document.getElementsByName('site')[1].disabled = false;
		document.getElementsByName('site')[2].disabled = false;
		//document.getElementById('searchAgain').disabled = false;
	} else {
		if (document.getElementById('searchAgain')) {
			document.getElementById('searchAgain').disabled = true;
		}
		
		if (document.getElementById('searchbtn')) {
			document.getElementById('searchbtn').disabled = true;
			document.getElementById('searchTextBox').disabled = true;
		}
		document.getElementsByName('site')[0].disabled = true;
		document.getElementsByName('site')[1].disabled = true;
		document.getElementsByName('site')[2].disabled = true;
		//document.getElementById('searchAgain').disabled = true;
	}
	console.log("selected--" + selNums + "--list len--" + listNodes.length);
	if (selNums < listNodes.length) {
		document.getElementById('selectall').checked = false;
	}
	if (selNums === listNodes.length) {
		document.getElementById('selectall').checked = true;
	}
}

function howManyChecked(liNodes) {
	var chked = 0;
	liNodes.forEach (function (liNode){
		if (liNode.childNodes[0].checked) {
			chked ++;
		}
	});
	return chked;
}

function atleastOneChecked(liNodes) {
	var chked = false;
	liNodes.forEach (function (liNode){
		if (liNode.childNodes[0].checked) {
			chked = true;
		}
	});
	
	return chked;
	
	/*console.log(Array.prototype.slice.call(chkBoxNodes).some(x => x.childNodes[0].checked));
	return Array.prototype.slice.call(chkBoxNodes).some(x => x.childNodes[0].checked);*/
}

function moreThanOneChecked(liNodes) {
	var n = 0;
	liNodes.forEach (function (liNode){
		if (liNode.childNodes[0].checked) {
			n ++;
		}
	});
	if (n === 0 || n > 1 ) {
		return true;
	} else {
		return false;
	}	
}

function addUrl() {
	getCurrentTabUrl(function(tab) {
		currentUrl = tab.url;
		var url = new URL(tab.url);
		var fullDomain = url.hostname;
		console.log("dom-" + fullDomain);
		 /*var hostNameArray = fullDomain.split(".");  
      
		console.log(hostNameArray.length);
		var domain = getDomain(currentUrl);
		var name = hostNameArray[1];//domain.split('.')[0];
		//var jsonObj = {};*/
		var name = getDomainName(tab.url);
		let textBox = document.getElementById('anonymus');
		var newObjArr = [];
		if (textBox) {
			console.log(textBox.value);
			if (textBox.value !== '') {
				var values = textBox.value.split('\n');
				values.forEach(function (value){
					var obj = {};
					var key = getKeyFromURL(value.split('/'));
					obj[key] = value;
					newObjArr.push(obj);
				});
			}
			//var newURLs = textBox.value ? textBox.value.replace('\n', ',') : '';
			console.log(newObjArr);
		}
		chrome.storage.sync.get( "jsonData", function(items) {
			console.log(JSON.stringify(items));
			var origObj = items.jsonData;
			//alert("before" + JSON.stringify(origObj));
			/*var prefForDom = origObj[fullDomain];
			if (prefForDom === undefined) {
				prefForDom = origObj[name];
			}*/
			//var prefForDom = origObj[fullDomain] || origObj[name];
			var prefForDom = getPreferences(fullDomain, name, origObj); 
			console.log("==" + prefForDom + "--- llllllll");
			var newEntryObj = {};
			var path = url.pathname.split('/');
			var key = getKeyFromURL(path);
			/*if (path.length === 0) {
				//newEntryObj[name] = currentUrl;
				key = name;
			} else {
				if (path[path.length-1].indexOf('=') === -1) {
					//newEntryObj[path[path.length-1]] = currentUrl;
					key = path[path.length-1];
				} else {
					//newEntryObj[path[1]] = currentUrl;
					key  = path[1];
				}
			}
			if (key === '') {
				key = 'Home';
			}*/
			newEntryObj[key] = currentUrl;
			console.log(newEntryObj);
			//if (newObjArr.length > 0) {
				newObjArr.push(newEntryObj);
			//}
			//path[path.length];
			//var nameKey = url.pathname.endsWith('/') ? url.pathname[url.pathname.length - 2] : url.pathname[url.pathname.length - 1];
			
			console.log(path.length);
			console.log("dom-" + path + "--" + path[path.length-1]);
			if (prefForDom) {
				console.log('in if');
				if (Array.isArray(prefForDom)) {
					prefForDom.push(newEntryObj);
				} else {
					var options = prefForDom;
					var type = document.getElementById("typeSelect");
					var selectedType = type.options[type.selectedIndex].value;
					
					var allTypes = options[selectedType];
					if (Array.isArray(options[selectedType])){
						options[selectedType].push(newEntryObj);
					} 
				}
				
				
			} else {
				console.log('in else');
				//origObj[name] = [currentUrl];
				var newObj = {};
				newObj["current"] = name;
				newObj["description"] = name;
				newObj["sites"] = newObjArr; //[newEntryObj];
				origObj[name] = newObj;
			}
			//origObj[name] = [currentUrl];
			console.log(JSON.stringify(origObj));
			//jsonObj = items;
			//console.log(JSON.stringify(jsonObj));
			chrome.storage.sync.set({
				jsonData: origObj},
				function() {
				// Update status to let user know options were saved.
				var status = document.getElementById('status');
				status.textContent = 'Options saved.';
				setTimeout(function() {
					status.textContent = '';
				}, 750);
			});
		});		
	});
}

function getKeyFromURL (path) {
	//var path = url.pathname.split('/');
	console.log(path);
	var key;
	if (path.length === 0) {
		//newEntryObj[name] = currentUrl;
		key = name;
	} else {
		if (path[path.length-1].indexOf('=') === -1) {
			//newEntryObj[path[path.length-1]] = currentUrl;
			key = path[path.length-1];
		} else {
			//newEntryObj[path[1]] = currentUrl;
			key  = path[1];
		}
	}
	if (key === '') {
		key = 'Home';
	}
	return key;
}

function searchAgain () {
	var urlSite = '';
	var selectedSite = getSearchSite();
	var selSiteArr;
	var idx = currentTab.index + 1;
	if (selectedSite.indexOf(',') > -1) {
		selSiteArr = selectedSite.split(',');
		selSiteArr.forEach(function(selSite){
			if (selSite.indexOf('yahoo') > -1) {
				urlSite = selSite + 'search;?p=' + queryString;
			 } else {
				urlSite = selSite + 'search?q=' + queryString;
			 }
			 
			 chrome.tabs.create({url: urlSite, active : false, index: parseInt(idx), windowId : invokedWindow}, function(tab) {
				idx ++;
			});
		});
	} else {
		 if (selectedSite.indexOf('yahoo') > -1) {
			urlSite = selectedSite + 'search;?p=' + queryString;
		 } else {
			urlSite = selectedSite + 'search?q=' + queryString;
		 }
		 chrome.tabs.create({url: urlSite, active : false, index: parseInt(currentTab.index + 1), windowId : invokedWindow}, function(tab) {
			
		});
		//chrome.tabs.update(currentTab.id, {url: urlSite});
	}
	
	window.close();
}

function getSearchSite() {
	var selectedSite;
	var site = document.getElementsByName("site");
	for(var i = 0; i < site.length; i++) {
	    if(site[i].checked) {
		    selectedSite = site[i].value;
			
		    if (!selectedSite.endsWith('/')) {
			   selectedSite = selectedSite + '/';
		    }
	    }
	}
	 
	return selectedSite;
}

function sortListDir() {
  var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
  list = document.getElementById("orderedList");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  //Make a loop that will continue until no switching has been done:
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    //Loop through all list-items:
    for (i = 0; i < (b.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*check if the next item should switch place with the current item,
      based on the sorting direction (asc or desc):*/
      if (dir == "asc") {
        if (b[i].innerText.toLowerCase() > b[i + 1].innerText.toLowerCase()) {
			console.log("THE TEXT--" + b[i].innerText);
          /*if next item is alphabetically lower than current item,
          mark as a switch and break the loop:*/
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (b[i].innerText.toLowerCase() < b[i + 1].innerText.toLowerCase()) {
          console.log("THE TEXT--" + b[i].innerText);
		  /*if next item is alphabetically higher than current item,
          mark as a switch and break the loop:*/
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
      //Each time a switch is done, increase switchcount by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount === 0 && dir == "asc") {
        dir = "desc";
        switching = true;
		
      }
    }
  }
  chngSortBtnValue();
}


function chngSortBtnValue() {
	var sortImg = document.getElementById('sortListDir');
	console.log(sortImg.getAttribute('src'));
	if (sortImg.getAttribute('src') === "./icons/Small_A_Z.jpg") {
		//sortImg.nextSibling.textContent = "Sort Z to A";
		sortImg.setAttribute('src', './icons/Small_Z_A.jpg');
	 } else if (sortImg.getAttribute('src') === "./icons/Small_Z_A.jpg") {
		//sortImg.nextSibling.textContent = "Sort A to Z";  
		sortImg.setAttribute('src', './icons/Small_A_Z.jpg');
	}
}

function searchInSite (queryString) {
	var urlSite = '';
	var searchText = document.getElementById('searchTextBox').value;
	console.log(searchText);
	if (searchText) {
		var url = new URL(currentUrl);
		
		var selectedSite = getSearchSite();

		 if (selectedSite.indexOf('yahoo') > -1) {
			urlSite = selectedSite + 'search;?p=' + searchText + '%20site:' + url.hostname;
		 } else {
			urlSite = selectedSite + 'search?q=' + searchText + '%20site:' + url.hostname;
		 }
		
		chrome.tabs.update(currentTab.id, {url: urlSite});
		
	}	
	window.close();
}


	
document.addEventListener('onbeforeunload', function (event) {
	console.log("unload..");
	//localStorage.removeItem(key);
	//window.localStorage.removeItem("googleSearch");
	/*window.onbeforeunload = function() {
	  
	  return '';
	};*/
	const allUrls = document.getElementsByName("link");
	var parentNode;
	allUrls.forEach (function (url) {
			console.log(url.parentNode);
			var itemValue = url.value;
			if (searchPage) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {highlight:false, selectedItems: itemValue}, function(response) {
					  console.log(response.farewell);
					}); 
				});
			}
			
		});
		
	
	window.close();
}, true);

function saveSelection() {
	getCurrentTabUrl(function(tab) {
		currentUrl = tab.url;
		var url = new URL(tab.url);
		var fullDomain = url.hostname;
		console.log("dom-" + fullDomain);
		var name = getDomainName(tab.url);
		
		chrome.storage.sync.get( "jsonData", function(items) {
			console.log(JSON.stringify(items));
			var origObj = items.jsonData;
			var prefForDom = getPreferences(fullDomain, name, origObj); 
			
			if (prefForDom) {
				if (Array.isArray(prefForDom)) {
					const allUrls = document.getElementsByName("link");
					allUrls.forEach (function (url) {
						console.log("chkd--" + url.checked);
						console.log("val--" + url.value);
						console.log(url.labels[0].innerText);
						console.log(JSON.stringify(prefForDom));
						console.log(prefForDom.length + "---long");
						var label = url.labels[0].innerText;
						//if (label) //need to remove (currentTab from label)
						if (label.indexOf("Current Tab")) {
							label = label.split('(')[0];
						}
						for (var i=0; i < prefForDom.length; i++) {
							if (typeof prefForDom[i] === 'object') {
								console.log(prefForDom[i]) ;
								if (Object.keys(prefForDom[i])[0] === label) {
									if (typeof Object.values(prefForDom[i])[0] === 'object') {
										prefForDom[i][label]['selected'] = url.checked;
									} else {
										prefForDom[i][label] = {'selected' : url.checked, url : Object.values(prefForDom[i])[0]};
									}
									
								}
							} else {
								if (prefForDom[i] === url.value) {
									prefForDom[i] = {[label] : {'selected' : url.checked, url : url.value}};
								}
							}
						}
						console.log(JSON.stringify(prefForDom));
						
					});
				} else {
					var options = prefForDom;
					var type = document.getElementById("typeSelect");
					var selectedType = type.options[type.selectedIndex].value;
					
					var allTypes = options[selectedType];
					if (Array.isArray(options[selectedType])){
						const allUrls = document.getElementsByName("link");
						
						allUrls.forEach (function (url) {
							var label = url.labels[0].innerText;
							if (label.indexOf("Current Tab")) {
								label = label.split('(')[0];
							}
							for (var i=0; i < allTypes.length; i++) {
								//console.log("vaan" + JSON.stringify(allTypes[i]));
								if (typeof allTypes[i] === 'object') {
									if (Object.keys(allTypes[i])[0] === label) {
										if (typeof Object.values(allTypes[i])[0] === 'object') {
											prefForDom[selectedType][i][label]['selected'] = url.checked;
										} else {
											prefForDom[selectedType][i][label] = {'selected' : url.checked, url : Object.values(allTypes[i])[0]};
										}
										
									}
								} else {
									if (allTypes[i] === url.value) {
										prefForDom[selectedType][i]= {[label]  : {'selected' : url.checked, url : url.value}};
									}
								}
							}
							console.log(JSON.stringify(prefForDom));
							
						});
					} 
				}
			} 
			console.log(JSON.stringify(origObj));
			chrome.storage.sync.set({
				jsonData: origObj},
				function() {
				// Update status to let user know options were saved.
				var status = document.getElementById('status');
				status.textContent = 'Options saved.';
				setTimeout(function() {
					status.textContent = '';
				}, 750);
			});
		});		
	});
	
	/*const allUrls = document.getElementsByName("link");
	var parentNode = allUrls[0].parentNode.parentNode.childNodes;
	changeSelection(parentNode);*/
}

function editTextArea () {
	let txtAreaContent = this.value;
	console.log("in txt are" + txtAreaContent);
	if (txtAreaContent === '') {
		document.getElementById('openbtn').disabled = true;
		document.getElementById("error").innerHTML = "";
	} else {
		document.getElementById('openbtn').disabled = false;
	}
}

function findInArray(array, item) {
	//var found = false;
	for (var x = 0; x < array.length; x ++) {
		console.log(array[x] + " ---" + item);
			console.log(item.indexOf(array[x]));
		
		if (item.indexOf(array[x]) > -1) {
			//found = true;
			//return found;
			
			return true;
		}
	}
	return false;
}

document.addEventListener('DOMContentLoaded', function () {
	/* var bgPage = chrome.extension.getBackgroundPage();
	 console.log("before");
     var bk = bgPage.test("abc"); // Here paste() is a function that returns value.
	 console.log("beforeAAA--" + bk);*/
	document.getElementById('mainStuff').hidden = true; 
	document.getElementById('cancelbtn').addEventListener('click', closeWindow);
	document.getElementById('openbtn').addEventListener('click', clickHandler);
	document.getElementById('selectall').addEventListener('click', selectall);
	document.getElementById('addbtn').addEventListener('click', addUrl);
	document.getElementById('savebtn').addEventListener('click', saveSelection);
	//document.getElementById('searchAgain').addEventListener('click', searchAgain);
	document.getElementById('sortListDir').addEventListener('click', sortListDir);
	//document.getElementById('searchbtn').addEventListener('click', searchInSite);
	//onclick="()";
	console.log("lod--" + loading);
	console.log("jsondata--" + jsonData);
	var content = document.getElementById('content');
    //chrome.storage.sync.set({loading: false}, function() {});
	//chrome.storage.sync.set({parentUrl: ""}, function() {});
	/*if (cnnLoading === 'loading') {
		window.close();
		return;
	}*/
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {exec:true}, function(response) {
			getCurrentTabUrl(function(tab) {
				currentUrl = tab.url;
				if (currentUrl === "chrome://newtab/") {
					//window.close();
					//return;
					newtab = true;
				} else {
					newtab = false;
				}
				
				var url = new URL(tab.url);
				var fullDomain = url.hostname;
				console.log("dom-" + fullDomain);
				 var hostNameArray = fullDomain.split(".");  
			  
				console.log(hostNameArray.length);
				//var domain = getDomain(currentUrl);
				var name = getDomainName(tab.url); //hostNameArray[1]; //domain.split('.')[0];
				console.log("currentUrl --" + currentUrl);
				console.log("name --" + name);
				console.log("lod--" + loading);
				console.log("jsondata--" + jsonData);
				if (loading) {
					window.close();
					return;
				}
				var prefForDom;
				//console.log("test--" + isFromSearch(currentUrl));
				console.log("loadFrom-" + loadFrom);
				console.log("going to  else part -- " + JSON.stringify(tab));
				var fromPage = true;
				
				prefForDom = getPreferences(url.hostname, name);
				console.log(prefForDom != undefined);
				console.log(findInArray(readPage, url.hostname));
				if (prefForDom != undefined && findInArray(readPage, url.hostname)) {
					console.log("inside if....");
					//if (loadFrom === 'config') {
						fromPage = false;
					//}
					createLoadOptions(content, "config");
					
				}
				
				if (!newtab) {
					if (fromPage) {
						console.log("from page" + name);
						console.log(findInArray(readPage, url.hostname) + "---" + isFromSearch(currentUrl, name));
						if (findInArray(readPage, url.hostname) || isFromSearch(currentUrl, name)) {
							console.log("inside google");
							searchEngine = name;
							//to do run content script from here //move this to top, put every thing inside callbak 
							
								 
							if (googleSearch === undefined || Object.keys(googleSearch).length === 0){ // || searchEngine.indexOf(url.hostname) === -1 
								//console.log("google seach list is empty");
								//window.close();
								//return;
								var text = document.createTextNode("No previous search results found. Please try a fresh search.");
								document.getElementById('openbtn').disabled = true;
								//document.getElementById('cancelbtn').hidden = "hidden";
								document.getElementById('selectall').disabled = true;
								document.getElementById('selectall').nextSibling.nodeValue = "";
								document.getElementById('sortListDir').disabled = true;
								console.log(document.getElementById('sortListDir').nextSibling.nodeValue + "fffk");
								
								//document.getElementById('sortListDir').nextSibling.nodeValue = "";
								//document.getElementById('searchAgain').hidden = "hidden";
								//document.getElementById('addbtn').hidden = "";
								content.appendChild(text);
								return;
								
							}
							console.log("Check1 " + JSON.stringify(googleSearch));
							prefForDom = googleSearch[name];
							console.log("check2-" + prefForDom + "-");
							document.getElementById('addbtn').disabled = true;
							document.getElementById('savebtn').disabled = true;
							//document.getElementById('searchbtn').hidden = "hidden";
							//document.getElementById('searchText').hidden = "hidden";
							content.style.width = "600px";
							document.getElementById('body').style.width = "603px";
							searchPage = true;
							if (googleSearch === "") {
								console.log("Search list is empty");
							}
							
							var engineName = name; //getDomainName(searchEngine); //new URL(searchEngine).hostname.split('.')[1];//domain.split('.')[0];
							var div = document.createElement('div');
							div.setAttribute("align", "center");
							var engineLogo = document.createElement("IMG");
							console.log("get favicon--" + name);
							engineLogo.setAttribute("src", 'chrome://favicon/'+ name); //searchEngine); 
							//engineLogo.setAttribute("src", '/icons/' + engineName + '.ico'); 
							engineLogo.style.cssFloat   = 'middle';
							div.appendChild(engineLogo);
							//var domain = getDomain(searchEngine);
							//var engineName = new URL(searchEngine).hostname.split('.')[1];//domain.split('.')[0];
							
							var searchEngineTxt = document.createTextNode(" " + engineName + " results.");
							div.appendChild(searchEngineTxt);
							content.appendChild(div);
						}
					}
					
					
					if (prefForDom === undefined) {
					   prefForDom = getPreferences(url.hostname, name); //jsonData[url.hostname] || jsonData[name];	
					   //content.style.width = "200px";
					  //document.getElementById('searchAgain').hidden = "hidden";
					   searchPage = false;
					}
					 
					
					
				
					console.log(jsonData);
					console.log(prefForDom);
					if(prefForDom){	
					//console.log(typeof allurls);
						loadList(prefForDom, content, name);
					} else {
						console.log("domain not set...");
						noConfigFound(content);
						/*var text = document.createTextNode("Domain not set in preference.");
						document.getElementById('openbtn').hidden = "hidden";
						document.getElementById('selectall').hidden = "hidden";
						document.getElementById('selectall').nextSibling.nodeValue = "";
						document.getElementById('sortListDir').hidden = "hidden";
						document.getElementById('sortListDir').nextSibling.nodeValue = "";
						document.getElementById('anonymus').hidden = "";
						content.appendChild(text);*/
						
					}
				 
			    } else {
					var mesg = "Bank Page.";
					noConfigFound(content, mesg);
				}
			}); 
			
			var xhr = new XMLHttpRequest();
			xhr.open('GET', chrome.extension.getURL('utube.json'));
			xhr.responseType = "text";

			xhr.onreadystatechange = function() {
				console.log("here");
				if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
					//console.log(xhr.responseText);
					//utubeData = xhr.responseText;
					utubeData = JSON.parse(xhr.responseText);
					console.log(utubeData);
					if (utubeData !== undefined) {
						var adStuff = document.getElementById('adStuff');
						//var utubeData = chrome.runtime.getURL("utube.json");
						console.log(utubeData);
						var keys = Object.keys(utubeData);
						var ranNum = randomIntFromInterval(0, 9);
						console.log("Me random" + ranNum);
						var utube = document.createElement('a');
						utube.textContent = keys[ranNum];
						utube.href = utubeData[keys[ranNum]];
						utube.onclick = utubeClick;
						adStuff.appendChild(utube);
						adStuff.appendChild(document.createElement('br'));
						/*keys.forEach(function (key) {
							//console.log(data);
							var utube = document.createElement('a');
							utube.textContent = key;
							utube.href = utubeData[key];
							utube.onclick = utubeClick;
							adStuff.appendChild(utube);
							adStuff.appendChild(document.createElement('br'));
						});*/
						
					}
				}
			};
			xhr.send();
			//
			
			//console.log("margin" + document.getElementById("selectall").style.margin);
			/*var delayMillis = 10000; //1 second

			setTimeout(function() {
			  //your code to be executed after 1 second
			  
			}, delayMillis);*/
			document.getElementById('mainStuff').hidden = false; 
			document.getElementById('progress').hidden = true;
			console.log(response.farewell);
		}); 
	});
		
});

function createLoadOptions(content, sele) {
	var loadDiv = document.createElement("div");
	loadDiv.style.width = '300px';
	var label = document.createElement("label");
	label.innerHTML = "Load from ";
	label.style.marginLeft = "25px";
	loadDiv.appendChild(label);
	
	var radio = document.createElement("INPUT"); 
	radio.setAttribute("type", "radio");
	radio.setAttribute("value", "config");
	radio.setAttribute("name", "loadFrom");
	if (sele === 'config')
		radio.checked = true; 
	radio.onclick = updateList;
	
	label = document.createElement("label");
	label.innerHTML = "Config";
	
	loadDiv.appendChild(radio);
	loadDiv.appendChild(label);
	
	radio = document.createElement("INPUT"); 
	radio.setAttribute("type", "radio");
	radio.setAttribute("value", "page");
	radio.setAttribute("name", "loadFrom");
	if (sele === 'page')
		radio.checked = true; 
	
	label = document.createElement("label");
	label.innerHTML = "Page";
	console.log("i m ann");
	radio.onclick = updateList;
	loadDiv.appendChild(radio);
	loadDiv.appendChild(label);
	content.appendChild(loadDiv);
	
}

function updateList(ele) { 
	
    console.log(ele.srcElement.value);
	if (ele.srcElement.value === 'page') {
		var content = document.getElementById('content');
		while (content.hasChildNodes()) {   
			content.removeChild(content.firstChild);
		}
		var searchContent = document.getElementById('searchContent');
		while (searchContent.hasChildNodes()) {   
			searchContent.removeChild(searchContent.firstChild);
		}
		createLoadOptions(content, "page");
		var name = getDomainName(currentUrl); 
		//prefForDom = googleSearch;
		//console.log("check2-" + prefForDom + "-");
		document.getElementById('addbtn').disabled = true;
		document.getElementById('savebtn').disabled = true;
		//document.getElementById('searchbtn').hidden = "hidden";
		//document.getElementById('searchText').hidden = "hidden";
		content.style.width = "600px";
		document.getElementById('body').style.width = "603px";
		searchPage = true;
		if (googleSearch === "") {
			console.log("Search list is empty");
		}
		var engineName = name;//getDomainName(searchEngine); //new URL(searchEngine).hostname.split('.')[1];//domain.split('.')[0];
		var div = document.createElement('div');
		div.setAttribute("align", "center");
		var engineLogo = document.createElement("IMG");
		console.log("get favicon--" + name);
		engineLogo.setAttribute("src", 'chrome://favicon/'+ name); //searchEngine); 
		//engineLogo.setAttribute("src", '/icons/' + engineName + '.ico'); 
		engineLogo.style.cssFloat   = 'middle';
		div.appendChild(engineLogo);
		//var domain = getDomain(searchEngine);
		//var engineName = new URL(searchEngine).hostname.split('.')[1];//domain.split('.')[0];
		
		var searchEngineTxt = document.createTextNode(" " + engineName + " results.");
		div.appendChild(searchEngineTxt);
		content.appendChild(div);
		loadList(googleSearch[name], content, name);
	} else if (ele.srcElement.value === 'config'){
		console.log("config part");
		var content = document.getElementById('content');
		while (content.hasChildNodes()) {   
			content.removeChild(content.firstChild);
		}
		var searchContent = document.getElementById('searchContent');
		while (searchContent.hasChildNodes()) {   
			searchContent.removeChild(searchContent.firstChild);
		}
		createLoadOptions(content, "config");
		var url = new URL(currentUrl);
		var name = getDomainName(currentUrl);
		searchPage = false;
		content.style.width = "200px";
		document.getElementById('body').style.width = "400px";
		document.getElementById('addbtn').disabled = false;
		document.getElementById('savebtn').disabled = false;
		loadList(getPreferences(url.hostname, name), content, name);
	}
	
	//content.removeAll();
	
}

function noConfigFound(content, msg) {
	console.log("domain not set...");
	var textContent = "\nYou may enter the URL's to open,one below the other,\nin the space given below and open them.";
	if (msg) {
		textContent = msg + textContent;
		document.getElementById('addbtn').disabled = true;
	} else {
		textContent = "Domain not set in preference." + textContent;
	}
	const divTxt = document.createElement("div");
	var pre = document.createElement("PRE");
	var text = document.createTextNode(textContent);//"Domain not set in preference.\nYou may enter the URL's to open,one below the other,\nin the space given below and open them.");
	pre.appendChild(text);
	divTxt.style.marginLeft = "25px";
	document.getElementById('openbtn').disabled = true;
	//document.getElementById('cancelbtn').hidden = "hidden";
	document.getElementById('selectall').disabled = true;
	//document.getElementById('selectall').nextSibling.nodeValue = "";
	document.getElementById('sortListDir').disabled = true;
	//document.getElementById('sortListDir').nextSibling.nodeValue = "";
	
	document.getElementById('savebtn').disabled = true;
	document.getElementById('anonymus').hidden = "";
	if (anonymus) {
		document.getElementById('anonymus').value = anonymus;
		document.getElementById('openbtn').disabled = false;
	}	
	document.getElementById('anonymus').onkeyup = editTextArea;
	
	
	divTxt.appendChild(pre);
	content.appendChild(divTxt);
	
}

function createRadio(content) {
	//var engDom = getDomain(searchEngine);
	//var engine = engDom.split('.')[0];
	//var engineUrl = new URL(searchEngine);
	//console.log("url hostname eng-" + engineUrl.hostname);
	var engine;
	if (searchPage) {
	//console.log(searchEngine + currentUrl);
		engine = searchEngine; //getDomainName(searchEngine); //engineUrl.hostname.split('.')[1];
	}
	
	var sitesArr = ['https://www.google.com/', 'https://search.yahoo.com/', 'https://www.bing.com/']; //searchSites.split(',');//, 'https://www.youtube.com/'
	
	var searchContent = document.getElementById('searchContent');
	
	var searchDiv = document.createElement('div');
	searchDiv.id = "searchDiv";
	searchDiv.style.margin = "0px 0px 0px 25px";
	searchDiv.style.width = '300px';
	
	var searchLbl = document.createElement('label');
	searchLbl.innerHTML = "search in";
	searchLbl.style.marginLeft = "25px";
	searchContent.appendChild(searchLbl);
	var br = document.createElement('br');
	searchContent.appendChild(br);
	/*var margin = true;*/
	
	var both;
	
	sitesArr.forEach(function (site) {
		var url = new URL(site);
		console.log("url hostname-" + url.hostname);
		var name = getDomainName(site);//url.hostname.split('.')[1];
		//var domain = getDomain(site);
		//var name = domain.split('.')[0];
		console.log("name " + name);
		console.log("engg " + engine);
		if (searchPage && name === engine) {
			return;
		}
		
		both = both ? both + "," + site :  site;
		console.log("both " + both);
		var radio = document.createElement("INPUT"); 
		radio.setAttribute("type", "radio");
		radio.setAttribute("value", site);
		radio.setAttribute("name", "site");
		selectAll ? radio.disabled = true : radio.disabled = false; 
		//radio.setAttribute("id", "site");
		//radio.style.marginLeft = "10px";
		console.log("site " + site);
		console.log("eng " + searchEngine);
		/*var url = new URL(site);
		var fullDomain = url.hostname;*/
		var label = document.createElement("label");
		label.innerHTML = name;
		//content.appendChild(radio);
		//content.appendChild(label);
		searchDiv.appendChild(radio);
		searchDiv.appendChild(label);
		searchContent.appendChild(searchDiv);
		
		
	});
	
	
	var searchAgainBtn = document.createElement('input');
	searchAgainBtn.setAttribute("type", "button");
	selectAll ? searchAgainBtn.disabled = true : searchAgainBtn.disabled = false;
	if (searchPage) {
		var radio = document.createElement("INPUT"); 
		radio.setAttribute("type", "radio");
		radio.setAttribute("value", both);
		radio.setAttribute("name", "site");
		selectAll ? radio.disabled = true : radio.disabled = false;
		var label = document.createElement("label");
		label.innerHTML = "Both";
		searchDiv.appendChild(radio);
		searchDiv.appendChild(label);
		searchAgainBtn.setAttribute("id", "searchAgain");
		searchAgainBtn.setAttribute("value", "Search Again");
		searchAgainBtn.onclick = searchAgain;
	} else {
		var searchAgainTxt = document.createElement('input');
		searchAgainTxt.setAttribute("type", "text");
		searchAgainTxt.setAttribute("id", "searchTextBox");
		selectAll ? searchAgainTxt.disabled = true : searchAgainTxt.disabled = false;
		//fsearchAgainTxt.style.marginLeft = "25px";
		searchDiv.appendChild(searchAgainTxt);
		searchAgainBtn.setAttribute("id", "searchbtn");
		searchAgainBtn.setAttribute("value", "Search");
		searchAgainBtn.onclick = searchInSite;
	}
	searchAgainBtn.style.marginLeft = '2px';
	searchDiv.appendChild(searchAgainBtn);
	
	searchContent.appendChild(searchDiv);
	
	/*if (selectAll) {
		const allUrls = document.getElementsByName("link");
		if (allUrls.length > -1) {
			if (howManyChecked(allUrls[0].parentNode.parentNode.childNodes)) {
				//radio.disabled = true;
				searchAgainBtn.disabled = true;
				document.getElementsByName('site')[0].style.disabled = true;
				document.getElementsByName('site')[1].style.disabled = true;
				document.getElementsByName('site')[2].style.disabled = true;
				if (!searchPage) {
					document.getElementById('searchTextBox').style.disabled = true;
				}
			}
			
		}
	}*/
	
	
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getPreferences(url_hostname, name, dataObj) {
	if (dataObj === undefined) {
		dataObj = jsonData;
	}
	console.log(url_hostname + " -- " + name );
	let pref;// = [];
	for (var item in dataObj) {
		let domain;
		domain = dataObj[item]['current'];
		console.log("DOMAIN--" + domain);
		if (domain.indexOf(',') === -1) {
			console.log("in no comma");
			//pref = [];
			//if (domain === url_hostname || domain === name) {
			if (domain.indexOf(url_hostname) > -1  || domain.indexOf(name)  > -1) {
				console.log("name matched....")
				if (domain.indexOf('http://') !== -1) {
					baseUrl = domain;
				} else {
					baseUrl = 'http://' + domain;
				}
				var sites = dataObj[item]['sites'];
				pref = sites;
				console.log("sites--" + sites);
			}
			console.log("in get pref " + JSON.stringify(pref));
		} else {
			var domArr = domain.split(',');
			domArr.forEach(function(hostname){
				if (url_hostname === hostname || name === hostname) {
					pref = dataObj[item]['sites'];
				}
			});
			console.log("in get pref " + pref);
		}
	}
	console.log(pref);
	return pref;
	
} 

function createList(allurls) {
	
	var list = document.createElement("OL"); 
	list.setAttribute("type", "1");
	list.setAttribute("id", "orderedList");
	//list.setAttribute("")
	if (!searchPage) {
		list.style.width = "100%";
		selectAll = true;
	}
	list.style.align = "right";
	
	var i=1;
	var value="";
	var bgColor = "#EDEEED"; //"#F4F6F7";
	
	allurls.forEach(function(page) {
		console.log("in createList " + JSON.stringify(page));
		//console.log(Object.keys(page));
		//console.log(Object.values(page));
		var input = document.createElement("INPUT"); 
		input.setAttribute("type", "checkbox");
		var label = document.createElement('label');
		
		var linkObj, key, url;
		if (typeof page === 'object') {
			console.log("has key value");
			if (Object.keys(page).length > 0){ //todo remove this condition 291217 ..any empty obj got into the jsonObj for washington post....due to which popup dint load...ths was added to handle that
				if (typeof Object.values(page)[0]  === 'object') {
					url = Object.values(page)[0];
					linkObj = url.url;
					if (linkObj.indexOf("http") === -1) {
						linkObj = baseUrl + linkObj;
					}
					input.setAttribute("value", linkObj);
					input.setAttribute("Alt", url.alt);
					if (currentUrl !== linkObj && url.selected !== false) { // && selectAll
						input.setAttribute("checked", true);
						label.style.fontWeight = "bold";
						if (searchPage) {
							var itemValue = input.value;
							chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
								chrome.tabs.sendMessage(tabs[0].id, {highlight:true, selectedItems: itemValue}, function(response) {
								  console.log(response.farewell);
								}); 
							});
						}
						
					} else {
						console.log("llll" + label.getText);
					}
				} else {
					linkObj = Object.values(page)[0];
					if (linkObj.indexOf("http") === -1) {
						linkObj = baseUrl + linkObj;
					}
					input.setAttribute("value", linkObj);
					console.log("in else");
					input.setAttribute("Alt", linkObj);
					if (currentUrl !== linkObj && selectAll) {
						input.setAttribute("checked", true);
						label.style.fontWeight = "bold";
						if (searchPage) {
							var itemValue = input.value;
							chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
								chrome.tabs.sendMessage(tabs[0].id, {highlight:true, selectedItems: itemValue}, function(response) {
								  console.log(response.farewell);
								}); 
							});
						}
					} else {
						console.log("llll" + label.getText);
					}
				}
				
				key = Object.keys(page)[0];
			
			}
			
		} else {
			var pageParts = page.split('/'); 
			console.log(pageParts.length);
			console.log(pageParts[pageParts.length - 1] );
			linkObj = page;
			if (linkObj.indexOf("http") === -1) {
				linkObj = baseUrl + linkObj;
			}
			key = page.endsWith('/') ? pageParts[pageParts.length - 2] : pageParts[pageParts.length - 1];
			input.setAttribute("value", linkObj);
			if (currentUrl !== linkObj && selectAll) {
				input.setAttribute("checked", true);
				label.style.fontWeight = "bold";
				if (searchPage) {
					var itemValue = input.value;
					chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
						chrome.tabs.sendMessage(tabs[0].id, {highlight:true, selectedItems: itemValue}, function(response) {
						  console.log(response.farewell);
						}); 
					});
				}
			} else {
				console.log("llll" + label.getText);
			}
			
		}
		input.setAttribute("name", "link");
		if (currentUrl === linkObj) {
			key =  key + "(Current Tab)";
			console.log("kkk"+key);
			document.getElementById('addbtn').disabled = true;
		}
		var id = key; //Object.keys(page)[0];
		input.setAttribute("id", id);
		input.onclick = chkBoxClick; 
		label.htmlFor = id;
		
		console.log("linkObj--" + linkObj);
		console.log("currentUrl--" + currentUrl);
			
		
		//var linkObj = Object.values(page)[0];
		
		
		
		 var li = document.createElement("LI");
		 li.style.backgroundColor = bgColor;
		 if (searchPage) 
			li.style.margin = "10px 0";
		
		 //li.setAttribute("background-color" , "#FFFEEC");
		var logo = document.createElement("IMG");
		console.log("link " + Object.values(page)[0]);
		logo.setAttribute("src", 'chrome://favicon/'+ linkObj); //Object.values(page)[0]);
		logo.setAttribute("width", "20");
		logo.setAttribute("height", "12");
		
		var link = document.createElement('a');
		link.textContent = id;
		link.href = linkObj; //Object.values(page)[0];
		link.title = linkObj;
		link.onclick = linkClick;
		label.appendChild(link);
		

		list.appendChild(li);
		li.appendChild(input);
		li.appendChild(logo);
		li.appendChild(label);
		//list.appendChild(input);
		//list.appendChild(logo);
		//list.appendChild(label);
		//var line = document.createElement('br');
		//list.appendChild(line);
		if (bgColor === "#EDEEED") {//ECF0F1 //"#F4F6F7"
			bgColor = "#FFFFFF";
		} else {
			bgColor = "#EDEEED"; //"#F4F6F7";
		}
	});
	/*var howmany = document.getElementById("howmany");
	if (selectAll) {
		howmany.textContent = allurls.length + " selected.";
	} else {
		howmany.textContent = "0 selected.";
	}*/
	return list;
	
	
}

function selectOption() {
	var content = document.getElementById('content');
	var orderedList = document.getElementById('orderedList');
	if (orderedList) {
		content.removeChild(orderedList);
	}
	
	var type = document.getElementById("typeSelect");
	var selectedType = type.options[type.selectedIndex].value;
	
	//var allTypes = jsonData[type.name];
	var url = new URL(currentUrl);

    //var allTypes = jsonData[url.hostname] || jsonData[type.name];
	var allTypes = getPreferences(url.hostname, type.name); //jsonData[url.hostname] || jsonData[name];
	if (Array.isArray(allTypes[selectedType])){
		content.appendChild(createList(allTypes[selectedType]));
	} 
	const allUrls = document.getElementsByName("link");
	var parentNode = allUrls[0].parentNode.parentNode.childNodes;
	changeSelection(parentNode);
	
}


function createDropDown (data, hierarchy) {
	var dropDown = document.createElement("SELECT"); 
	dropDown.setAttribute("id", "typeSelect");
	dropDown.setAttribute("name", hierarchy);
	var keys = Object.keys(data);
	keys.forEach(function (optn) {
		var options = document.createElement("option");
		options.setAttribute("value", optn);
		options.setAttribute("id", optn);
		var txt = document.createTextNode(optn);
		options.appendChild(txt);
		if (optn.indexOf("default") > -1) {
			options.selected = true;
		}
		dropDown.appendChild(options);
	});
	dropDown.onchange = selectOption; 
	return dropDown;
	
}

	
function getDomain(url, subdomain) {
	//var isSubdom = isSubdomain(url);
	subdomain = subdomain || false;

    url = url.replace(/(https?:\/\/)?(www.)?/i, '');

    if (!subdomain) {
        url = url.split('.');

        url = url.slice(url.length - 2).join('.');

    }

    if (url.indexOf('/') !== -1) {
        return url.split('/')[0];
    }

    return url;
}

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
	 
	var tab = tabs[0];
    //var url = tab.url;
currentTab = tab;
	callback(tab);
  });
  
  chrome.windows.getCurrent(function(currentWindow) {
    invokedWindow = currentWindow.id;
  });

}
  
 function utubeClick() {
	var idx = currentTab.index + 1;
	chrome.tabs.create({url: this.href, active : false, index: idx, windowId : invokedWindow}, function(tab) {
		
	});
 }
 function isParentGoogle(parentUrl) {
	// var url = new URL(parentUrl);
	// console.log("azhagiye...." + url.hostname);
	//return google.indexOf(url.hostname) > -1;
 }
 
 function isFromSearch(currentURL, name) {
	 //console.log("Check1 " + JSON.stringify(googleSearch));
	 console.log("Check22 " + currentURL);
	 var urlFound = false;
	 if (googleSearch && googleSearch[name]) {
		 googleSearch[name].forEach(function (obj) {
			 var value = Object.values(obj);
			 console.log("Check3 " + value);
			 if (value == currentURL) {
				 console.log("ret true");
				 urlFound = true;
			 }
		 });
	 }
	return urlFound;
 }
 
 function getDomainName(url) {
	 var hostname = new URL(url).hostname;
	 var hostArr = hostname.split('.');
	 console.log(hostArr.length + "---yyy");
	 console.log(hostArr);
	 if (hostArr.length === 2) {
		 return hostArr[0];
	 } else if (hostArr.length === 4) { 
		if (hostArr[0] === 'www') {
			return hostArr[1];
		} else {
			return hostArr[2];
		}
	 } else {
		 return hostArr[1];
	 }
 }
 
  function isUrlInList(currentURL, urlList) {
	 //console.log("Check1 " + JSON.stringify(googleSearch));
	 console.log("Check22 " + currentURL);
	 var urlFound = false;
	 
		 urlList.forEach(function (obj) {
			 var value = Object.values(obj);
			 console.log("Check3 " + value);
			 if (value == currentURL) {
				 console.log("ret true");
				 urlFound = true;
			 }
		 });
	 
	return urlFound;
 }
 
 chrome.runtime.onMessage.addListener(function(req, sender, sendres){
	 if (req.cnnLoading === "complete") {
		console.log("cnn loaded....")
	 }
	
	
});

function loadList(prefForDom, content, name) {
	if (Array.isArray(prefForDom)) {
		console.log("pref dom is an array");
		if (prefForDom.length > 0) {
			content.appendChild(createList(prefForDom));
		} else {
			noConfigFound(content);
		}
	} else {
		content.appendChild(createDropDown(prefForDom, name));
		var label = document.createElement('label');
		var txt = document.createTextNode("Options ");
		label.setAttribute("for", "typeSelect");
		label.appendChild(txt);
		label.style.marginLeft = "25px";
		content.insertBefore(label,document.getElementById("typeSelect"));
		var type = document.getElementById("typeSelect");
		//type.style.marginLeft = "25px";
		var selectedType = type.options[type.selectedIndex].value;
		content.appendChild(createList(prefForDom[selectedType]));
	}
	//document.getElementsByName("link").addEventListener('click', chkBoxClick);
	if (selectAll && searchPage) {
		document.getElementById('selectall').checked = true;
	}
	createRadio(content);
	//document.getElementById('addbtn').hidden = "hidden";
	const allUrls = document.getElementsByName("link");
	console.log(allUrls[0]);
	var parentNode = allUrls[0].parentNode.parentNode.childNodes;
	changeSelection(parentNode);
	
}
