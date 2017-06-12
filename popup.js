var jsonData;
var currentTab;
var highlightTabs;
var tabsBackground;
var currentUrl;
var invokedWindow;

var options = ['tabsBackground', 'highlightTabs', 'jsonData'];

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
        } else {
            console.log("came till here in else");
        }
    });

    /*if (highlightTabs) {
     chrome.tabs.highlight({tabs: tabToHilite}, function(){});
     }*/
    chrome.storage.sync.set({urlsToOpen: [], currTab : "", invokedWindow : "", opnSmeTb : ""}, function() {});
    var opnSmeTab = document.getElementById("sametabChkbx").checked;
    chrome.storage.sync.set({urlsToOpen: urlsToOpen, currTab: currentTab, invokedWindow: invokedWindow, opnSmeTb: opnSmeTab}, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
    window.close();
}

function selectall () {
    const allUrls = document.getElementsByName("link");
    if (document.getElementById('selectall').checked) {
        allUrls.forEach (function (url) {
            url.checked = true;
            url.nextSibling.nextSibling.style.fontWeight = "bold";
            document.getElementById("openbtn").disabled = false;
            document.getElementById("sametab").hidden = true;
            document.getElementById("sametabChkbx").checked = false;
        });
    } else {
        allUrls.forEach (function (url) {
            url.checked = false;
            console.log(url.parentNode);
            url.nextSibling.nextSibling.style.fontWeight = "normal";
            document.getElementById("openbtn").disabled = true;
            document.getElementById("sametab").hidden = true;
            document.getElementById("sametabChkbx").checked = false;
        });
    }


}

function linkClick () {
    console.log(this.href);
    const opnSmeTab = document.getElementById("sametabChkbx").checked;
    chrome.storage.sync.set({urlsToOpen: [], currTab : "", invokedWindow : "", opnSmeTb : ""}, function() {});
    chrome.storage.sync.set({urlsToOpen: this.href, currTab: currentTab, invokedWindow: invokedWindow, opnSmeTb: opnSmeTab}, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
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
            document.getElementById("sametab").hidden = false;
            document.getElementById("sametabChkbx").checked = true;
        } else {
            document.getElementById("sametab").hidden = true;
            document.getElementById("sametabChkbx").checked = false;
        }
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
    }
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
        var hostNameArray = fullDomain.split(".");

        console.log(hostNameArray.length);
        var domain = getDomain(currentUrl);
        var name = domain.split('.')[0];
        //var jsonObj = {};

        chrome.storage.sync.get( "jsonData", function(items) {
            console.log(JSON.stringify(items));
            var origObj = items.jsonData;
            //alert("before" + JSON.stringify(origObj));
            var prefForDom = origObj[fullDomain];
            if (prefForDom === undefined) {
                prefForDom = origObj[name];
            }

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
                origObj[name] = [currentUrl];
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


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cancelbtn').addEventListener('click', closeWindow);
    document.getElementById('openbtn').addEventListener('click', clickHandler);
    document.getElementById('selectall').addEventListener('click', selectall);
    document.getElementById('addbtn').addEventListener('click', addUrl);

    var content = document.getElementById('content');

    getCurrentTabUrl(function(tab) {
        currentUrl = tab.url;
        var url = new URL(tab.url);
        var fullDomain = url.hostname;
        console.log("dom-" + fullDomain);
        var hostNameArray = fullDomain.split(".");

        console.log(hostNameArray.length);
        var domain = getDomain(currentUrl);
        var name = domain.split('.')[0];
        console.log("name --" + name);
        var prefForDom = jsonData[url.hostname] || jsonData[name];

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

        } else {
            var text = document.createTextNode("Domain not set in preference.");
            document.getElementById('openbtn').hidden = "hidden";
            document.getElementById('cancelbtn').hidden = "hidden";
            document.getElementById('selectall').hidden = "hidden";

            //document.getElementById('addbtn').hidden = "";
            content.appendChild(text);
            //document.getElementById('typeSelect').addEventListener('changed', selectOption);
        }

    });

    //console.log("margin" + document.getElementById("selectall").style.margin);

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
            console.log();
            linkObj = page;
            key = page.endsWith('/') ? pageParts[pageParts.length - 2] : pageParts[pageParts.length - 1];
        }
        var input = document.createElement("INPUT");
        //var linkObj = Object.values(page)[0];
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", linkObj);
        input.setAttribute("name", "link");
        var id = key; //Object.keys(page)[0];
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
        logo.setAttribute("src", 'chrome://favicon/'+ linkObj); //Object.values(page)[0]);
        logo.setAttribute("width", "20");
        logo.setAttribute("height", "12");
        var label = document.createElement('label');
        label.htmlFor = id;
        label.style.fontWeight = "bold";

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

    var url = new URL(currentUrl);

    var allTypes = jsonData[url.hostname] || jsonData[type.name];

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

    chrome.windows.getCurrent(function(currentWindow) {
        invokedWindow = currentWindow.id;
    });

}
