var jsonData;
var currentTab;
var highlightTabs;
var tabsBackground;

var options = ['tabsBackground', 'highlightTabs', 'jsonData']

/*
 var xhr = new XMLHttpRequest();
 xhr.open('GET', chrome.extension.getURL('pages.json'), true);
 xhr.onreadystatechange = function() {
 console.log("here");
 if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
 console.log(xhr.responseText);
 jsonData = JSON.parse(xhr.responseText);
 }
 };
 xhr.send();
 */
chrome.storage.sync.get( options, function(items) {
    jsonData = items.jsonData;
    highlightTabs = items.highlightTabs;
    tabsBackground = items.tabsBackground;
});

function closeWindow (e) {
    window.close();
}


function clickHandler(e) {

    var allUrls = document.getElementsByName("link");
    var urlsToOpen = [];
    var tabToHilite = [currentTab.index];
    var openAt = currentTab.index + 1;
    allUrls.forEach (function (url) {
        console.log(url);
        if (url.checked) {
            urlsToOpen.push(url.value);
            /*chrome.tabs.create({url: url.value, active : !tabsBackground, index: openAt}, function(tab){
             tabToHilite.push(tab.index);
             openAt ++;
             });*/


        }
    });

    /*if (highlightTabs) {
     chrome.tabs.highlight({tabs: tabToHilite}, function(){});
     }*/
    chrome.storage.sync.set({"urlsToOpen": urlsToOpen, currTab : currentTab}, function() {
    });




    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cancelbtn').addEventListener('click', closeWindow);
    document.getElementById('openbtn').addEventListener('click', clickHandler);
    var content = document.getElementById('content');

    getCurrentTabUrl(function(tab) {
        var currentUrl = tab.url;
        var url = new URL(tab.url)
        var domain1 = url.hostname;
        console.log("dom-" + domain1);
        var hostNameArray = domain1.split(".");

        console.log(hostNameArray.length);
        var domain = getDomain(currentUrl);
        var name = domain.split('.')[0];
        var allurls = jsonData[name];
        console.log(jsonData);
        if(jsonData[name]){
            var list = document.createElement("UL");
            var i=1;
            var value="";
            allurls.forEach(function(page) {
                console.log(Object.keys(page)[0]);
                console.log(Object.values(page)[0]);
                var input = document.createElement("INPUT");
                var linkObj = Object.values(page)[0];
                input.setAttribute("type", "checkbox");
                input.setAttribute("value", Object.values(page)[0]);
                input.setAttribute("name", "link");
                var id = Object.keys(page)[0];
                input.setAttribute("id", id);

                if (typeof linkObj === 'object') {
                    input.setAttribute("value", linkObj.url);
                    input.setAttribute("Alt", linkObj.alt);
                    if (currentUrl !== linkObj && linkObj.selected !== false) {
                        input.setAttribute("checked", true);
                    }
                } else {
                    input.setAttribute("value", linkObj);
                    input.setAttribute("Alt", linkObj);
                    if (currentUrl !== linkObj[0]) {
                        input.setAttribute("checked", true);
                    }
                }
                var label = document.createElement('label');
                label.htmlFor = id;
                label.appendChild(document.createTextNode(id));
                list.appendChild(input);
                list.appendChild(label);
                var line = document.createElement('br');
                list.appendChild(line);
            });
            content.appendChild(list);
        } else {
            var text = document.createTextNode("Domain not set in preference.");
            content.appendChild(text);
        }
    });

});

function getDomain(url, subdomain) {
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

    chrome.tabs.query(queryInfo, function (tabs) {

        var tab = tabs[0];
        //var url = tab.url;
        currentTab = tab;
        callback(tab);
    });
}