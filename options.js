/**
 * Created by gdev on 3/18/2017.
 */

function save_options() {
    alert("in save");
    var jsonData = document.getElementById('jsonData').value;
    var tabsBackground = document.getElementById('tabsBackground').checked;
    var highlightTabs = document.getElementById('highlightTabs').checked;
    var selectAll = document.getElementById('selectAll').checked;
    var timeOut = document.getElementById('timeOut').value;
    var tabToLoad = document.getElementById('tabToLoad').value;
    //var loadFrom = document.getElementsByName('loadFrom')[0].checked ? document.getElementsByName('loadFrom')[0].value : document.getElementsByName('loadFrom')[1].value;
    //var searchSites = document.getElementById('searchSites').value;
    alert(tabToLoad);
    if (jsonData.trim() === '') {
        return;
    }
    const dataLen = jsonData.replace(/\s/g, '').length;
    var jsonObj = {};
    document.getElementById("error").innerHTML = "";
    try {
        jsonObj = JSON.parse(jsonData);
        const objLen = JSON.stringify(jsonObj).replace(/\s/g, '').length;
        if (dataLen > objLen) {
            throw new Error("The given json seems to have duplicate keys..Please check and try again");
        }
        validJson(jsonObj);
        var domValues = Object.values(jsonObj);
        domValues.forEach(function(val){
            //alert(val);
            var keys = Object.keys(val);
            //alert(keys);
            if (keys.indexOf('sites') === -1 || keys.indexOf('current') === -1) {
                //alert ("in if");
                throw new Error("The given json seems to have different schema..Please check and try again");
            }
        });
    } catch(err) {
        //alert (err);
        document.getElementById("error").innerHTML = err.message;
        return;
    }

    chrome.storage.sync.set({
            jsonData: jsonObj,
            tabsBackground: tabsBackground,
            highlightTabs: highlightTabs,
            selectAll: selectAll,
            timeOut : timeOut,
            tabToLoad : tabToLoad},
        function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        });

}

function checkIfArrayIsUnique(myArray) {
    return myArray.length === new Set(myArray).size;
}

function validJson(jsonObj) {
    //alert (jsonObj);
    //alert("all keys-" + Object.values(jsonObj));
    const keys = Object.keys(jsonObj);
    //alert(keys);
    //alert("check" + checkIfArrayIsUnique (keys))
    /*if (!checkIfArrayIsUnique (keys)) {
        alert("The given json seems to have duplicate keys..Please correct and try again");
        //throw new Error("The given json seems to have duplicate keys..Please correct and try again");
    }*/
    //var baseUrl;
    for (var item in jsonObj) {
        //alert(item);
        var current = jsonObj[item]['current'];
        var sites = jsonObj[item]['sites'];
        var linkObj;

        for (var index in sites) {
            //alert(JSON.stringify(sites[index]));
            if (Array.isArray(sites[index])) {
                //alert("is array" + JSON.stringify(sites[index][0]));
                sites[index].forEach(function(siteItem){
                    //linkObj = siteItem;
                    //alert("Link-A-" + JSON.stringify(linkObj));
                    if (typeof siteItem === 'object') {
                        if (typeof Object.values(siteItem)[0] === 'object') {
                            linkObj = Object.values(siteItem)[0].url;
                            //alert("Link-A--1-" + JSON.stringify(linkObj));
                        } else {
                            linkObj = Object.values(siteItem)[0];
                            //alert("Link-A--2-" + JSON.stringify(linkObj));
                        }
                    }
                    if (linkObj.indexOf("http") === -1) {
                        linkObj = getBaseURL(current) + linkObj;
                    }
                    if (doesUrlRepeat(linkObj, jsonObj, current)) {
                        return;
                    }
                });
            } else if (typeof sites[index] === 'object') {
                if (typeof Object.values(sites[index])[0] === 'object') {
                    linkObj = Object.values(sites[index])[0].url;
                    //alert("Link-B-" + linkObj);
                } else {
                    linkObj = Object.values(sites[index])[0];
                    //alert("Link-C-" + linkObj);
                }
                if (linkObj.indexOf("http") === -1) {
                    linkObj = getBaseURL(current) + linkObj;
                }
                if (doesUrlRepeat(linkObj, jsonObj, current)) {
                    return;
                }
            }  else {
                linkObj = sites[index];
                //alert("Link-D-" + linkObj);
                if (linkObj.indexOf("http") === -1) {
                    linkObj = getBaseURL(current) + linkObj;
                }
                if (doesUrlRepeat(linkObj, jsonObj, current)) {
                    return;
                }
            }


            /*if (typeof sites[index] === 'object') {
                //alert("is obj-" + JSON.stringify(Object.values(sites[index])));
                if (typeof Object.values(sites[index])[0] === 'object') {
                    linkObj = Object.values(sites[index])[0].url;
                } else {
                    linkObj = Object.values(sites[index])[0];
                }
            } else {
                linkObj = sites[index];
            }*/
            /*if (doesUrlRepeat(linkObj, jsonObj, current)) {
                return;
            }*/
        }

    }
}

function getBaseURL(current) {
    var baseUrl;
    if (current.indexOf(',') === -1) {
        if (current.indexOf('http://') !== -1 || current.indexOf('https://') !== -1) {
            baseUrl = current;
        } else {
            baseUrl = 'http://' + current;
        }
    }
    return baseUrl;
}

function doesUrlRepeat(linkObj, jsonObj, current) {
    var firstOccurance = true;

    for (var item in jsonObj) {
        var curr = jsonObj[item]['current'];
        var sites = jsonObj[item]['sites'];

        /*sites.forEach(function (site) {
            alert ("for each " + JSON.stringify(site));
        });

        for (var index in sites) {
            alert ("for loop " + JSON.stringify(sites[sites]));
        }*/
        //alert("current--" + current + "--curr--" + curr);
        //if (curr !== current) {
        for (var index in sites) {
            if (Array.isArray(sites[index])) {
                sites[index].forEach(function(siteItem){
                    //linkObj = siteItem;
                    //alert("Link-A-" + JSON.stringify(linkObj));
                    var url;
                    if (typeof siteItem === 'object') {
                        if (typeof Object.values(siteItem)[0] === 'object') {
                            url = Object.values(siteItem)[0].url;
                            //alert("Link-A--1-" + JSON.stringify(linkObj));
                        } else {
                            url = Object.values(siteItem)[0];
                            //alert("Link-A--2-" + JSON.stringify(linkObj));
                        }
                    }
                    if (url.indexOf("http") === -1) {
                        url = getBaseURL(curr) + url;
                    }
                    //alert("link--" + linkObj + "\n" + "site--" + url);
                    if (linkObj === url) {
                        //alert("me here AA");
                        //alert("The url " + linkObj + "is defined under " + current + " and " + curr + "..Please correct and try again");
                        if (!firstOccurance) {
                            let mesg;
                            if (curr === current) {
                                mesg = "The url " + linkObj + " is defined twice under "  + current + "..Please correct and try again.";
                            } else {
                                mesg = "The url " + linkObj + " is defined under " + current + " and " + curr + "..Please correct and try again.";
                            }
                            throw new Error(mesg);
                            return true;
                        }
                        firstOccurance = false;

                    }
                });
            } else if (typeof sites[index] === 'object') {
                var url;
                if (typeof Object.values(sites[index])[0] === 'object') {
                    url = Object.values(sites[index])[0].url;
                } else {
                    url = Object.values(sites[index])[0];
                }
                if (url.indexOf("http") === -1) {
                    url = getBaseURL(curr) + url;
                }
                //alert("link--" + linkObj + "\n" + "site--" + url);

                if (linkObj === url) {
                    //alert("me here A");
                    //alert("The url " + linkObj + "is defined under " + current + " and " + curr + "..Please correct and try again");
                    if (!firstOccurance) {
                        let mesg;
                        if (curr === current) {
                            mesg = "The url " + linkObj + " is defined twice under "  + current + "..Please correct and try again.";
                        } else {
                            mesg = "The url " + linkObj + " is defined under " + current + " and " + curr + "..Please correct and try again.";
                        }
                        throw new Error(mesg);
                        return true;
                    }
                    firstOccurance = false;
                }

            } else {
                var url = sites[index];
                if (url.indexOf("http") === -1) {
                    url = getBaseURL(curr) + url;
                }
                //alert("link--" + linkObj + "\n" + "site--" + url);

                if (linkObj === url) {
                    //alert("me here B");
                    //	alert("The url " + linkObj + "is defined under " + current + " and " + curr + "..Please correct and try again");
                    if (!firstOccurance) {
                        let mesg;
                        if (curr === current) {
                            mesg = "The url " + linkObj + " is defined twice under "  + current + "..Please correct and try again.";
                        } else {
                            mesg = "The url " + linkObj + " is defined under " + current + " and " + curr + "..Please correct and try again.";
                        }
                        throw new Error(mesg);
                        return true;
                    }
                    firstOccurance = false;
                }
            }
        }
        //}
    }
    return false;
}
// Restores tabsBackground state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get( "jsonData", function(items) {
        var content = document.getElementById('jsonData');
        var text = document.createTextNode(JSON.stringify(items.jsonData, null, "\t"));
        alert(JSON.stringify(items.jsonData, null, "\t"));
        //var text = document.createTextNode(library.json.prettyPrint(JSON.stringify(items.jsonData, null, "\t")));
        //var text = document.createTextNode(library.json.prettyPrint(account));

        content.appendChild(text);

    });
    chrome.storage.sync.get({
        tabsBackground: true,
        highlightTabs: true,
        selectAll: true,
        timeOut: 30,
        tabToLoad : 2,
        jsonData : '{}'
    }, function(items) {
        document.getElementById('tabsBackground').checked = items.tabsBackground;
        document.getElementById('highlightTabs').checked = items.highlightTabs;
        document.getElementById('selectAll').checked = items.selectAll;
        document.getElementById('timeOut').value = items.timeOut;
        document.getElementById('tabToLoad').value = items.tabToLoad;
        document.getElementById('jsonData').value = JSON.stringify(items.jsonData, null, "\t");

        /*alert(items.loadFrom);
        if (items.loadFrom === 'config'){
            document.getElementsByName('loadFrom')[0].checked = true;
        } else {
            document.getElementsByName('loadFrom')[1].checked = true;
        } */

        //document.getElementById('searchSites').value = items.searchSites;


    });
}

function replacer(key, value) {
    alert(JSON.stringify(key));
    alert(JSON.stringify(value));
    return "<font color='blue'>" + value + "</font>";
}

var account = { active: true, codes: [48348, 28923, 39080], city: "London" };

if (!library)
    var library = {};

library.json = {
    replacer: function(match, pIndent, pKey, pVal, pEnd) {
        var key = '<span class=json-key>';
        var val = '<span class=json-value>';
        var str = '<span class=json-string>';
        var r = pIndent || '';
        if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal)
            r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
        return r + (pEnd || '');
    },
    prettyPrint: function(obj) {
        var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
        return JSON.stringify(obj, null, 3)
            .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(jsonLine, library.json.replacer);
    }
};

function cancel_options () {
    window.close();
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('cancel').addEventListener('click', cancel_options);

/*
function save_options() {
    var prefDomain = document.getElementById('prefDomain').value;
	var prefUrl = document.getElementById('prefUrl').value;
    //var highlightTabs = document.getElementById('highlightTabs').checked;
	alert(prefDomain);
	var urls={};

	urls[prefDomain] = [prefUrl];

	chrome.storage.sync.get( "preferedPages", function(items) {
		alert("items" + JSON.stringify(items));
		var origObj = items.preferedPages;
		alert("before" + JSON.stringify(origObj));

		if (origObj[prefDomain]) {
			origObj[prefDomain].push(prefUrl);
		} else {
			origObj[prefDomain] = [prefUrl];
		}

		urls = origObj;
		alert("final--" + JSON.stringify(urls));
		chrome.storage.sync.set({preferedPages: origObj}, function() {
			// Update status to let user know options were saved.
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() {
				status.textContent = '';
			}, 750);
		});
		//items.preferedPages.prefDomain.push(prefUrl);
		//alert("after changing" + items.preferedPages.prefDomain.push(prefUrl));
    });
}

// Restores tabsBackground state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get( "preferedPages", function(items) {
		var content = document.getElementById('content');
		var text = document.createTextNode(JSON.stringify(items));
		var data = items.preferedPages;
		var table = document.createElement("TABLE");
		table.setAttribute("id", "table");
		content.appendChild(table);
		var tr = document.createElement("TR");
		tr.setAttribute("id", "heading");
		table.appendChild(tr);

		var col1 = document.createElement("TD");
		var cell1 = document.createTextNode("Domain");
		col1.appendChild(cell1);
		tr.appendChild(col1);

		var col2 = document.createElement("TD");
		var cell2 = document.createTextNode("Preferred URL");
		col2.appendChild(cell2);
		tr.appendChild(col2);

		var col3 = document.createElement("TD");
		var cell3 = document.createTextNode("Delete");
		col3.appendChild(cell3);
		tr.appendChild(col3);

		table.style.border =  "thin solid #000000";
		//tr.style.border =  "thin solid #000000";
		col1.style.border =  "thin solid #000000";
		col2.style.border =  "thin solid #000000";
		col3.style.border =  "thin solid #000000";
		var rowIndex = 0;
		Object.keys(data).forEach(function(domain, index){
			var rowSpan = (data[domain]).length;
			data[domain].forEach(function(url, url_index) {
				var dataRow = document.createElement("TR");
				dataRow.id = rowIndex;
				table.appendChild(dataRow);
				if (url_index === 0) {
					var col1 = document.createElement("TD");
					col1.rowSpan = rowSpan;
					var cell1 = document.createTextNode(domain);
					col1.appendChild(cell1);
					col1.style.border =  "thin solid #000000";
					dataRow.appendChild(col1);
				}
				var col2 = document.createElement("TD");
				var cell2 = document.createTextNode(url);
				col2.appendChild(cell2);
				col2.style.border =  "thin solid #000000";
				dataRow.appendChild(col2);
				var col3 = document.createElement("TD");
				var cell3 = document.createElement("INPUT");
				cell3.type = "checkbox";
				cell3.id = domain;
				cell3.name = "delete_chkbx";
				col3.appendChild(cell3);
				col3.align = "center";
				col3.style.border =  "thin solid #000000";
				dataRow.appendChild(col3);
				rowIndex++;
			});

		});
		//content.appendChild(text);

    });
}

function delete_selected_options() {
	alert("in delete");
	var allChBx = document.getElementsByName("delete_chkbx");

	chrome.storage.sync.get( "preferedPages", function(items) {
		alert("items" + JSON.stringify(items));
		var origObj = items.preferedPages;
		allChBx.forEach (function (chkbx) {
			//alert(chkbx);
			if (chkbx.checked) {
				//alert("chked");
				var rowObj = chkbx.parentElement.parentElement;
				var rowId = chkbx.parentElement.parentElement.id;
				var domain;
				var url;
				//alert(rowObj.childNodes.length);
				if (rowObj.childNodes.length === 2) {
					domain = chkbx.id;
					url = rowObj.childNodes[0].innerHTML;
				} else {
					domain = rowObj.childNodes[0].innerHTML;
					url = rowObj.childNodes[1].innerHTML;
				}
				alert(rowId + "--" + domain + "--" + url);
				alert("orig obj" + JSON.stringify(origObj));
				var urlIndex = origObj[domain].indexOf(url);
				alert("index in obj-" + urlIndex);
				origObj[domain].splice(urlIndex, 1);
				alert("obj after delete" + JSON.stringify(origObj));
			}
		});
		alert("obj after delete" + JSON.stringify(origObj));
		chrome.storage.sync.set({preferedPages: origObj}, function() {
			// Update status to let user know options were saved.
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() {
				status.textContent = '';
			}, 750);
		});
		//items.preferedPages.prefDomain.push(prefUrl);
		//alert("after changing" + items.preferedPages.prefDomain.push(prefUrl));
    });


}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('delete').addEventListener('click', delete_selected_options);
*/