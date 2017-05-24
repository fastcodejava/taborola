var jsonData;
var currentTab;
var highlightTabs;
var tabsBackground;
var currentUrl;

var options = ['tabsBackground', 'highlightTabs', 'jsonData']

/*
 var xhr = new XMLHttpRequest();
 xhr.open('GET', chrome.extension.getURL('chrome://favicon/http://www.amazon.in'));
 xhr.responseType = "blob";

 xhr.onreadystatechange = function() {
 console.log("here");
 if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
 console.log(xhr.responseText);
 //var ico = JSON.parse(xhr.responseText);
 }
 };
 xhr.send();*/

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
            console.log("came till here");
            /*chrome.tabs.create({url: url.value, active : !tabsBackground, index: openAt}, function(tab){
             tabToHilite.push(tab.index);
             openAt ++;
             });*/


        } else {
            console.log("came till here in else");
        }
    });

    /*if (highlightTabs) {
     chrome.tabs.highlight({tabs: tabToHilite}, function(){});
     }*/
    var opnSmeWindw = document.getElementById("samewindowChkbx").checked;
    chrome.storage.sync.set({"urlsToOpen": urlsToOpen, "currTab": currentTab, "opnSmeWin": opnSmeWindw}, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });




    window.close();
}

function selectall () {
    var allUrls = document.getElementsByName("link");
    if (document.getElementById('selectall').checked) {
        allUrls.forEach (function (url) {
            url.checked = true;
            url.nextSibling.nextSibling.style.fontWeight = "bold";
            document.getElementById("openbtn").disabled = false;
            document.getElementById("samewindow").hidden = true;
            document.getElementById("samewindowChkbx").checked = false;
        });
    } else {
        allUrls.forEach (function (url) {
            url.checked = false;
            console.log(url.parentNode);
            url.nextSibling.nextSibling.style.fontWeight = "normal";
            document.getElementById("openbtn").disabled = true;
            document.getElementById("samewindow").hidden = true;
            document.getElementById("samewindowChkbx").checked = false;
        });
    }


}

function chkBoxClick (ele) {
    console.log(this.labels[0].innerHTML);
    var currNode = this;
    var none = true;
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
            document.getElementById("samewindow").hidden = false;
            document.getElementById("samewindowChkbx").checked = true;
        } else {
            document.getElementById("samewindow").hidden = true;
            document.getElementById("samewindowChkbx").checked = false;
        }
    } else {
        this.labels[0].style.fontWeight="normal";
        document.getElementById("openbtn").disabled = true;
        document.getElementById("samewindow").hidden = true;
        document.getElementById("samewindowChkbx").checked = false;
        if (atleastOneChecked(this.parentNode.parentNode.childNodes)) {
            document.getElementById("openbtn").disabled = false;
        }
        if (moreThanOneChecked(this.parentNode.parentNode.childNodes)) {
            console.log("more than one checked");
            document.getElementById("samewindow").hidden = true;
            document.getElementById("samewindowChkbx").checked = false;
        } else {
            document.getElementById("samewindow").hidden = false;
            document.getElementById("samewindowChkbx").checked = true;
        }
    }
}

function atleastOneChecked(chkBoxNodes) {
    console.log(Array.prototype.slice.call(chkBoxNodes).some(x => x.childNodes[0].checked));
    return Array.prototype.slice.call(chkBoxNodes).some(x => x.childNodes[0].checked);
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
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cancelbtn').addEventListener('click', closeWindow);
    document.getElementById('openbtn').addEventListener('click', clickHandler);
    document.getElementById('selectall').addEventListener('click', selectall);
    var content = document.getElementById('content');

    getCurrentTabUrl(function(tab) {
        currentUrl = tab.url;
        var url = new URL(tab.url)
        var domain1 = url.hostname;
        console.log("dom-" + domain1);
        var hostNameArray = domain1.split(".");

        console.log(hostNameArray.length);
        var domain = getDomain(currentUrl);
        var name = domain.split('.')[0];
        var prefForDom = jsonData[name];
        console.log(jsonData);
        console.log(prefForDom);
        if(jsonData[name]){
            //console.log(typeof allurls);
            if (Array.isArray(prefForDom)) {
                content.appendChild(createList(prefForDom));
            } else {
                content.appendChild(createDropDown(prefForDom, name));
                var type = document.getElementById("typeSelect");
                type.style.marginLeft = "25px";
                var selectedType = type.options[type.selectedIndex].value;
                content.appendChild(createList(prefForDom[selectedType]));
            }
            //document.getElementsByName("link").addEventListener('click', chkBoxClick);

        } else {
            var text = document.createTextNode("Domain not set in preference.");
            content.appendChild(text);
            //document.getElementById('typeSelect').addEventListener('changed', selectOption);
        }

    });

    console.log("margin" + document.getElementById("selectall").style.margin);

});

function createList(allurls) {

    var list = document.createElement("OL");
    list.setAttribute("type", "1");
    list.setAttribute("id", "orderedList");
    //list.setAttribute("")
    list.style.align = "right";
    var i=1;
    var value="";
    var bgColor = "#F4F6F7";
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
        input.onclick = chkBoxClick;

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
        var li = document.createElement("LI");
        li.style.backgroundColor = bgColor;
        //li.setAttribute("background-color" , "#FFFEEC");
        var logo = document.createElement("IMG");
        console.log("link " + Object.values(page)[0]);
        logo.setAttribute("src", 'chrome://favicon/'+ Object.values(page)[0]);
        logo.setAttribute("width", "20");
        logo.setAttribute("height", "12");
        var label = document.createElement('label');
        label.htmlFor = id;
        label.style.fontWeight = "bold";
        label.appendChild(document.createTextNode(id));


        list.appendChild(li);
        li.appendChild(input);
        li.appendChild(logo);
        li.appendChild(label);
        //list.appendChild(input);
        //list.appendChild(logo);
        //list.appendChild(label);
        //var line = document.createElement('br');
        //list.appendChild(line);
        if (bgColor === "#F4F6F7") {//ECF0F1
            bgColor = "#FFFFFF";
        } else {
            bgColor = "#F4F6F7";
        }
    });
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

    var allTypes = jsonData[type.name];
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
}
