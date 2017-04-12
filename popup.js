var urls = {

};


function clickHandler(e) {

    var urlsToOpen = document.getElementsByName("link");
    urlsToOpen.forEach(function (toOpen){
        if(toOpen.checked == true) {
            chrome.tabs.create({url: toOpen.value, active : false });
        }
    });
    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('openbtn').addEventListener('click', clickHandler);
    var content = document.getElementById('content');

    getCurrentTabUrl(function(currentUrl) {
        var domain = getDomain(currentUrl);
        var name = domain.split('.')[0];
        var allurls = Object.keys(urls);

        allurls.forEach(function(url, index) {
            if (url === name) {
                console.log(index);
                var pages = Object.values(urls)[index];
                var list = document.createElement("UL");
                var i=1;
                var value="";
                pages.forEach(function(page) {
                    console.log(Object.keys(page)[0]);
                    console.log(Object.values(page)[0]);
                    var input = document.createElement("INPUT");
                    input.setAttribute("type", "checkbox");
                    var linkObj = Object.values(page)[0];
                    input.setAttribute("name", "link");

                    if (typeof linkObj === 'object') {
                        input.setAttribute("value", linkObj.url);
                        input.setAttribute("Alt", linkObj.alt);
                        if (currentUrl !== linkObj && linkObj.selected !== false) {
                            input.setAttribute("checked", true);
                        }
                    } else {
                        input.setAttribute("value", linkObj);
                        input.setAttribute("Alt", linkObj);
                        if (currentUrl !== linkObj) {
                            input.setAttribute("checked", true);
                        }
                    }
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
        var url = tab.url;
        callback(url);
    });

}