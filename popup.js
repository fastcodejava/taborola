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

var options = ['tabsBackground', 'highlightTabs', 'jsonData', 'selectAll', 'loading', 'googleSearch', 'parentUrl', 'queryString', 'searchEngine'];
var google = ['www.google.co.in', 'www.google.com', 'search.yahoo.com', 'www.bing.com'];



chrome.storage.sync.get( options, function(items) {
    jsonData = items.jsonData;
    highlightTabs = items.highlightTabs;
    tabsBackground = items.tabsBackground;
    selectAll = items.selectAll;
    loading = items.loading;
    console.log("in sync get" + loading);
    googleSearch = items.googleSearch;
    parentUrl = items.parentUrl;
    queryString = items.queryString;
    //searchSites = items.searchSites;
    searchEngine = items.searchEngine;
});

function closeWindow (e) {

    window.close();
}


function clickHandler(e) {
    //loading = true;
    const allUrls = document.getElementsByName("link");
    const urlsToOpen = [];
    const tabToHilite = [currentTab.index];
    const openAt = currentTab.index + 1;
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
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {highlight:false, selectedItems: itemValue}, function(response) {
                    console.log(response.farewell);
                });
            });

        } else {
            console.log("came till here in else");
        }
    });

    /*if (highlightTabs) {
        chrome.tabs.highlight({tabs: tabToHilite}, function(){});
    }*/
    chrome.storage.sync.set({urlsToOpen: [], currTab : "", invokedWindow : "", opnSmeTb : "", loading: false}, function() {});
    var opnSmeTab = document.getElementById("sametabChkbx").checked;
    chrome.storage.sync.set({urlsToOpen: urlsToOpen, currTab: currentTab, invokedWindow: invokedWindow, opnSmeTb: opnSmeTab, loading: true}, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
    window.close();
}

function selectall () {
    const allUrls = document.getElementsByName("link");
    var parentNode;
    if (document.getElementById('selectall').checked) {
        allUrls.forEach (function (url) {
            if (currentUrl !== url.value) {
                url.checked = true;
                url.nextSibling.nextSibling.style.fontWeight = "bold";
                document.getElementById("openbtn").disabled = false;
                document.getElementById("sametab").hidden = true;
                document.getElementById("sametabChkbx").checked = false;
            }
            parentNode = url.parentNode.parentNode.childNodes;
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
        }
    } else {
        allUrls.forEach (function (url) {
            url.checked = false;
            console.log(url.parentNode);
            url.nextSibling.nextSibling.style.fontWeight = "normal";
            document.getElementById("openbtn").disabled = true;
            document.getElementById("sametab").hidden = true;
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
        var howmany = document.getElementById("howmany");
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
        document.getElementsByName('site')[2].disabled = false;
        //document.getElementById('searchAgain').disabled = false;
    }


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
            document.getElementById("sametab").hidden = false;
            document.getElementById("sametabChkbx").checked = true;
        } else {
            document.getElementById("sametab").hidden = true;
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
        document.getElementById("sametab").hidden = true;
        document.getElementById("sametabChkbx").checked = false;
        if (atleastOneChecked(this.parentNode.parentNode.childNodes)) {
            document.getElementById("openbtn").disabled = false;
        }
        if (moreThanOneChecked(this.parentNode.parentNode.childNodes)) {
            console.log("more than one checked");
            document.getElementById("sametab").hidden = true;
            document.getElementById("sametabChkbx").checked = false;
        } else {
            document.getElementById("sametab").hidden = false;
            document.getElementById("sametabChkbx").checked = true;
        }

        var itemValue = this.value;
        if (searchPage) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {highlight:false, selectedItems: itemValue}, function(response) {
                    console.log(response.farewell);
                });
            });
        }

    }
    var howmany = document.getElementById("howmany");
    var selNums = howManyChecked(this.parentNode.parentNode.childNodes);
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
    if (selNums < this.parentNode.parentNode.childNodes.length) {
        document.getElementById('selectall').checked = false;
    }
    if (selNums === this.parentNode.parentNode.childNodes.length) {
        document.getElementById('selectall').checked = true;
    }
    //console.log("len--" + this.parentNode.parentNode.childNodes.length);
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

            if (prefForDom) {
                if (Array.isArray(prefForDom)) {
                    prefForDom.push(currentUrl);
                } else {
                    var options = prefForDom;
                    var type = document.getElementById("typeSelect");
                    var selectedType = type.options[type.selectedIndex].value;

                    var allTypes = options[selectedType];
                    if (Array.isArray(options[selectedType])){
                        options[selectedType].push(currentUrl);
                    }
                }


            } else {
                //origObj[name] = [currentUrl];
                var newObj = {};
                newObj["current"] = name;
                newObj["description"] = name;
                newObj["sites"] = [currentUrl];
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
//console.log("outside -- " + JSON.stringify(jsonObj));

    });
}

//chrome.runtime.onMessage.addListener(messageReceived);
/*
function messageReceived(msg) {
	console.log(msg);
   if (msg === "completed") {
	   loading = false;
   }
}*/

function searchAgain () {
    var urlSite = '';
    //var url = new URL(currentUrl);
    //var fullDomain = url.hostname;
    //console.log(queryString);
    //console.log(url.hostname);
    //urlSite = queryString + '%20site:' + url.hostname;
    //console.log(urlSite);

    var selectedSite = getSearchSite();
    var selSiteArr;
    var idx = currentTab.index + 1;
    //window.close;
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
            if (switchcount == 0 && dir == "asc") {
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

        /*var site = document.getElementsByName("site");
        for(var i = 0; i < site.length; i++) {
           if(site[i].checked) {
               selectedSite = site[i].value;
               if (!selectedSite.endsWith('/')) {
                   selectedSite = selectedSite + '/';
               }
           }


         } */
        if (selectedSite.indexOf('yahoo') > -1) {
            urlSite = selectedSite + 'search;?p=' + searchText + '%20site:' + url.hostname;
        } else {
            urlSite = selectedSite + 'search?q=' + searchText + '%20site:' + url.hostname;
        }

        chrome.tabs.update(currentTab.id, {url: urlSite});

    }
    //var url = new URL(currentUrl);
    //var fullDomain = url.hostname;
    //console.log(queryString);
    //console.log(url.hostname);
    //urlSite = queryString + '%20site:' + url.hostname;
    //console.log(urlSite);
    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    /* var bgPage = chrome.extension.getBackgroundPage();
     console.log("before");
     var bk = bgPage.test("abc"); // Here paste() is a function that returns value.
     console.log("beforeAAA--" + bk);*/
    document.getElementById('cancelbtn').addEventListener('click', closeWindow);
    document.getElementById('openbtn').addEventListener('click', clickHandler);
    document.getElementById('selectall').addEventListener('click', selectall);
    document.getElementById('addbtn').addEventListener('click', addUrl);
    //document.getElementById('searchAgain').addEventListener('click', searchAgain);
    document.getElementById('sortListDir').addEventListener('click', sortListDir);
    //document.getElementById('searchbtn').addEventListener('click', searchInSite);
    onclick="()"
    console.log("lod--" + loading);
    console.log("jsondata--" + jsonData);
    var content = document.getElementById('content');
    //chrome.storage.sync.set({loading: false}, function() {});
    //chrome.storage.sync.set({parentUrl: ""}, function() {});
    getCurrentTabUrl(function(tab) {
        currentUrl = tab.url;
        if (currentUrl === "chrome://newtab/") {
            window.close();
            return;
        }

        var url = new URL(tab.url);
        var fullDomain = url.hostname;
        console.log("dom-" + fullDomain);
        var hostNameArray = fullDomain.split(".");

        console.log(hostNameArray.length);
        var domain = getDomain(currentUrl);
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
        console.log("test--" + isFromSearch(currentUrl));
        if (google.indexOf (url.hostname) > -1 || isFromSearch(currentUrl)) {
            if (googleSearch === undefined || Object.keys(googleSearch).length === 0)  {
                //console.log("google seach list is empty");
                //window.close();
                //return;
                var text = document.createTextNode("No previous search results found. Please try a fresh search.");
                document.getElementById('openbtn').hidden = "hidden";
                //document.getElementById('cancelbtn').hidden = "hidden";
                document.getElementById('selectall').hidden = "hidden";
                document.getElementById('selectall').nextSibling.nodeValue = "";
                document.getElementById('sortListDir').hidden = "hidden";
                console.log(document.getElementById('sortListDir').nextSibling.nodeValue + "fffk");

                document.getElementById('sortListDir').nextSibling.nodeValue = "";
                //document.getElementById('searchAgain').hidden = "hidden";
                //document.getElementById('addbtn').hidden = "";
                content.appendChild(text);
                return;

            }
            console.log("Check1 " + JSON.stringify(googleSearch));
            prefForDom = googleSearch;
            console.log("check2-" + prefForDom + "-");
            document.getElementById('addbtn').hidden = "hidden";
            //document.getElementById('searchbtn').hidden = "hidden";
            //document.getElementById('searchText').hidden = "hidden";
            content.style.width = "600px";
            document.getElementById('body').style.width = "603px";
            searchPage = true;
            if (googleSearch === "") {
                console.log("Search list is empty");
            }
            var div = document.createElement('div');
            div.setAttribute("align", "center");
            var engineLogo = document.createElement("IMG");
            engineLogo.setAttribute("src", 'chrome://favicon/'+ searchEngine);
            engineLogo.style.cssFloat   = 'middle';
            div.appendChild(engineLogo);
            var domain = getDomain(searchEngine);
            var engineName = new URL(searchEngine).hostname.split('.')[1];//domain.split('.')[0];

            var searchEngineTxt = document.createTextNode(" " + engineName + " results.");
            div.appendChild(searchEngineTxt);
            content.appendChild(div);
        }

        if (prefForDom === undefined) {
            prefForDom = getPreferences(url.hostname, name); //jsonData[url.hostname] || jsonData[name];
            //content.style.width = "200px";
            //ocument.getElementById('searchAgain').hidden = "hidden";
            searchPage = false;
        }




        console.log(jsonData);
        console.log(prefForDom);
        if(prefForDom){
            //console.log(typeof allurls);
            if (Array.isArray(prefForDom)) {
                content.appendChild(createList(prefForDom));
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
            if (selectAll) {
                document.getElementById('selectall').checked = true;
            }
            createRadio(content);
        } else {
            var text = document.createTextNode("Domain not set in preference.");
            document.getElementById('openbtn').hidden = "hidden";
            //document.getElementById('cancelbtn').hidden = "hidden";
            document.getElementById('selectall').hidden = "hidden";
            document.getElementById('selectall').nextSibling.nodeValue = "";
            document.getElementById('sortListDir').hidden = "hidden";
            document.getElementById('sortListDir').nextSibling.nodeValue = "";
            //document.getElementById('addbtn').hidden = "";
            content.appendChild(text);
            //document.getElementById('typeSelect').addEventListener('changed', selectOption);
        }




    });

    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('youtube.json'));
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

});

function createRadio(content) {
    var engDom = getDomain(searchEngine);
    //var engine = engDom.split('.')[0];
    var engineUrl = new URL(searchEngine);
    console.log("url hostname eng-" + engineUrl.hostname);
    var engine = getDomainName(searchEngine); //engineUrl.hostname.split('.')[1];
    var sitesArr = ['https://www.google.com/', 'https://search.yahoo.com/', 'http://www.bing.com/']; //searchSites.split(',');

    var searchContent = document.getElementById('searchContent');

    var searchDiv = document.createElement('searchDiv');
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
        //radio.setAttribute("id", "site");
        var label = document.createElement("label");
        label.innerHTML = "Both";
        //content.appendChild(radio);
        //content.appendChild(label);
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
        searchAgainTxt.style.marginLeft = "25px";
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
    /*var pref = dataObj[url_hostname] || dataObj[name];
    if (pref) {
        return pref;
    } else {
        var hostNameKeys = Object.keys(dataObj);
        hostNameKeys.forEach(function(key) {
            if (key.indexOf(',') !== -1) {
                var hostnameArr = key.split(',');
                hostnameArr.forEach(function(hostname){
                    if (url_hostname === hostname || name === hostname) {
                        pref = dataObj[key];
                        //return pref;
                    }
                });
            }

        });
        return pref;
    }*/
    //console.log(JSON.stringify(dataObj));
    for(var item in dataObj) {
        var domain,pref;
        domain = dataObj[item]['current'];
        if (domain === url_hostname || domain === name) {
            pref = dataObj[item]['sites'];
        }

        if (pref) {
            return pref;
        } else {
            if (domain.indexOf(',') !== -1) {
                var domArr = domain.split(',');
                domArr.forEach(function(hostname){
                    if (url_hostname === hostname || name === hostname) {
                        pref = dataObj[item]['sites'];
                        //return pref;
                    }
                });
            }

        }
        //console.log(dataObj[item]['current']);

    }
    console.log(pref);
    return pref;

}

function createList(allurls) {

    var list = document.createElement("OL");
    list.setAttribute("type", "1");
    list.setAttribute("id", "orderedList");
    //list.setAttribute("")
    list.style.align = "right";

    var i=1;
    var value="";
    var bgColor = "#EDEEED"; //"#F4F6F7";
    allurls.forEach(function(page) {
        console.log("in createList " + JSON.stringify(page));
        //console.log(Object.keys(page));
        //console.log(Object.values(page));
        var linkObj, key;
        if (typeof page === 'object') {
            console.log("has key value");
            linkObj = Object.values(page)[0];
            key = Object.keys(page)[0];
        } else {
            var pageParts = page.split('/');
            console.log(pageParts.length);
            console.log(pageParts[pageParts.length - 1] );
            linkObj = page;
            key = page.endsWith('/') ? pageParts[pageParts.length - 2] : pageParts[pageParts.length - 1];
        }
        console.log("linkObj--" + linkObj);
        console.log("currentUrl--" + currentUrl);

        var input = document.createElement("INPUT");
        //var linkObj = Object.values(page)[0];
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", linkObj);
        input.setAttribute("name", "link");
        if (currentUrl === linkObj) {
            key =  key + "(Current Tab)";
            console.log("kkk"+key);
        }
        var id = key; //Object.keys(page)[0];
        input.setAttribute("id", id);
        input.onclick = chkBoxClick;


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
        var label = document.createElement('label');
        label.htmlFor = id;

        if (typeof linkObj === 'object') {
            console.log("in if");
            input.setAttribute("value", linkObj.url);
            input.setAttribute("Alt", linkObj.alt);
            if (currentUrl !== linkObj && linkObj.selected !== false && selectAll) {
                input.setAttribute("checked", true);
                label.style.fontWeight = "bold";
                var itemValue = input.value;
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {highlight:true, selectedItems: itemValue}, function(response) {
                        console.log(response.farewell);
                    });
                });
            } else {
                console.log("llll" + label.getText);
            }
        } else {
            console.log("in else");
            input.setAttribute("value", linkObj);
            input.setAttribute("Alt", linkObj);
            if (currentUrl !== linkObj && selectAll) {
                input.setAttribute("checked", true);
                label.style.fontWeight = "bold";
                var itemValue = input.value;
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {highlight:true, selectedItems: itemValue}, function(response) {
                        console.log(response.farewell);
                    });
                });
            } else {
                console.log("llll" + label.getText);
            }
        }


        var link = document.createElement('a');
        link.textContent = id;
        link.href = linkObj; //Object.values(page)[0];
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
    var howmany = document.getElementById("howmany");
    if (selectAll) {
        howmany.textContent = allurls.length + " selected.";
    } else {
        howmany.textContent = "0 selected.";
    }
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

function isFromSearch(currentURL) {
    //console.log("Check1 " + JSON.stringify(googleSearch));
    console.log("Check22 " + currentURL);
    var urlFound = false;
    if (googleSearch) {
        googleSearch.forEach(function (obj) {
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
    if (hostArr.length === 2) {
        return hostArr[0];
    } else {
        return hostArr[1];
    }
}