var urls = {
    "amazon": [
        {"Books": "http://www.amazon.in/books"},
        {"Kitchen": "http://www.amazon.in/kitchen"},
        {"Grocery": "http://www.amazon.in/Gourmet-Specialty-Foods"},
        {"Mobile-Phones": "http://www.amazon.in/mobile-phones"}
    ],
    "cnn" : [
        {"Regions": "http://edition.cnn.com/regions"},
        {"Politics": "http://edition.cnn.com/politics"},
        {"International": "http://money.cnn.com/INTERNATIONAL/"},
        {"Entertainment": "http://edition.cnn.com/entertainment"},
        {"Technology": "http://money.cnn.com/technology/"}
    ]
};


function clickHandler(e) {

    var allUrls = document.getElementsByName("link");
    var urlsToOpen = [];
    allUrls.forEach (function (url) {
        console.log(url);
        if (url.checked) {
            chrome.tabs.create({url: url.value, active : false});
        }
    });




    window.close();
}
function closeWindow (e) {
    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cancelbtn').addEventListener('click', closeWindow);
    document.getElementById('openbtn').addEventListener('click', clickHandler);
    var content = document.getElementById('content');

    var jsonData;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('mypages.json'), true);
    xhr.onreadystatechange = function() {
        console.log("here");
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            console.log(xhr.responseText);
            jsonData = JSON.parse(xhr.responseText);
        }
    };
    xhr.send();

    getCurrentTabUrl(function(currentUrl) {
        var domain = getDomain(currentUrl);
        var name = domain.split('.')[0];
        var allurls = jsonData[name];
        console.log(jsonData[name]);
        if(jsonData[name]){
            var list = document.createElement("UL");
            var i=1;
            var value="";
            allurls.forEach(function(page) {
                console.log(Object.keys(page)[0]);
                console.log(Object.values(page)[0]);
                var input = document.createElement("INPUT");
                input.setAttribute("type", "checkbox");
                input.setAttribute("value", Object.values(page)[0]);
                input.setAttribute("name", "link");
                var id = Object.keys(page)[0];
                input.setAttribute("id", id);

                var label = document.createElement('label');
                label.htmlFor = id;
                label.appendChild(document.createTextNode(id));
                list.appendChild(input);
                list.appendChild(label);
                var line = document.createElement('br');
                list.appendChild(line);
            });
            content.appendChild(list);
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

    chrome.tabs.query(queryInfo, function(tabs) {

        var tab = tabs[0];
        var url = tab.url;
        callback(url);
    });

}
