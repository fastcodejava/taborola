var jsonData;
var currentTab;

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



function closeWindow (e) {
    window.close();
}

function clickHandler(e) {


    var allUrls = document.getElementsByName("link");
    var urlsToOpen = [];
    allUrls.forEach (function (url) {
        console.log(url);
        if (url.checked) {
            urlsToOpen.push(url.value);
        }
    });
    // alert("kkk" + urlsToOpen);
    // var firstUrl = urlsToOpen.shift();

    var pos = currentTab.index + 1;
    urlsToOpen.forEach(function (url) {
        chrome.tabs.create({url: url, active : false, index: pos++});
    });

    // chrome.tabs.create({url: firstUrl, active : false}, function (tab) {
    // alert(firstUrl);

    // urlsToOpen.forEach(function (url) {
    //     chrome.tabs.create({url: url, active : false});
    // });

    // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // alert("in update");
    // alert(tab.url + "kkk" + firstUrl);

    /*if (tab.url === firstUrl && changeInfo.status == 'complete') {*/
    // alert('done');
    // urlsToOpen.forEach(function (toOpen){
    // chrome.tabs.create({url: toOpen, active : false});
    // });
    //return;
    //}
    // });
    // });
    // alert(" first" + firstUrl);

    window.close();
}
function openTab(urlToOpen) {
    chrome.tabs.create({url: urlToOpen, active : false});
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        // alert("in update");
        // alert(tab.url + "kkk" + urlToOpen);

        if (tab.url === urlToOpen && changeInfo.status == 'complete') {
            alert('done');
            return;
        }
    });

}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cancelbtn').addEventListener('click', closeWindow);
    document.getElementById('openbtn').addEventListener('click', clickHandler);

    var content = document.getElementById('content');
    chrome.tabs.getCurrent(function (callback) {
        console.log(callback);
    });

    chrome.tabs.getSelected(null, function(tab){
        console.log(tab);
    });

    getCurrentTabUrl(function(tab) {
        var currentUrl = tab.url;
        var domain = getDomain(currentUrl);
        var name = domain.split('.')[0];
        //console.log("fff" + JSON.stringify());
        //var allurls = Object.keys(urls);
        //console.log(allurls);
        //allurls.forEach(function(url, index) {
        //if (url === name) {
        var allurls = jsonData[name];
        //console.log(index);
        //var pages = Object.values(urls)[index];
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
        //}
        //});
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
        // var url = tab.url;
        currentTab = tab;
        callback(tab);
    });
}