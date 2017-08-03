/**
 * Created by gdev on 3/18/2017.
 */

function save_options() {
    var jsonData = document.getElementById('jsonData').value;
    var tabsBackground = document.getElementById('tabsBackground').checked;
    var highlightTabs = document.getElementById('highlightTabs').checked;
    var selectAll = document.getElementById('selectAll').checked;
    var timeOut = document.getElementById('timeOut').value;

    if (jsonData.trim() === '') {
        return;
    }
    var jsonObj = {};
    document.getElementById("error").innerHTML = "";
    try {
        jsonObj = JSON.parse(jsonData);
    } catch(err) {
        document.getElementById("error").innerHTML = err.message;
        return;
    }

    chrome.storage.sync.set({
            jsonData: jsonObj,
            tabsBackground: tabsBackground,
            highlightTabs: highlightTabs,
            selectAll: selectAll,
            timeOut : timeOut},
        function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        });

}

// Restores tabsBackground state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get( "jsonData", function(items) {
        var content = document.getElementById('jsonData');
        //var textArea = document.createElement("TEXTAREA");
        //textArea.rows = "10";
        //textArea.cols = "50";
        var text = document.createTextNode(JSON.stringify(items.jsonData, null, "\t"));
        //textArea.appendChild(text);
        //var data = items.preferedPages;

        content.appendChild(text);

    });
    chrome.storage.sync.get({
        tabsBackground: true,
        highlightTabs: true,
        selectAll: true,
        timeOut: 30
    }, function(items) {
        document.getElementById('tabsBackground').checked = items.tabsBackground;
        document.getElementById('highlightTabs').checked = items.highlightTabs;
        document.getElementById('selectAll').checked = items.selectAll;
        document.getElementById('timeOut').value = items.timeOut;
    });
}

function replacer(key, value) {
    alert(JSON.stringify(key));
    alert(JSON.stringify(value));
    return "<font color='blue'>" + value + "</font>";
}

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