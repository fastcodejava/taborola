/**
 * Created by gdev on 3/19/2017.
 */
var highlightTabs;
var tabsBackground;
var currWindow;

var options = ['tabsBackground', 'highlightTabs'];


var loading_images = ['ajax-loader_LB.gif',
    'ajax-loader_LT.gif',
    'ajax-loader_RT.gif',
    'ajax-loader_RB.gif'];

var image_index = 0;

var keep_switching_icon;

function rotateIcon(rotate)
{
    keep_switching_icon = rotate === undefined ? keep_switching_icon : rotate;
    const image = keep_switching_icon ? "icons/" + loading_images[image_index] : "icons/ic_title_black_24dp_1x.png";
    chrome.browserAction.setIcon({path: image});
    image_index = (image_index + 1) % loading_images.length;

    if ( keep_switching_icon )
    {
        window.setTimeout(rotateIcon, 300);
    }
}

chrome.storage.sync.get( options, function(items) {
    highlightTabs = items.highlightTabs;
    tabsBackground = items.tabsBackground;
});

chrome.windows.getCurrent(function(win){
    currWindow = win.id;
});

chrome.storage.sync.get(function(data) {
    //console.log("data sync " + JSON.stringify(data));
});
chrome.storage.onChanged.addListener(function(changes, area) {
    //console.log("in bkgd page" + JSON.stringify(changes));
    //console.log("currWindow from bkg" + currWindow);

    if (area == "sync" && "urlsToOpen" in changes) {
        var urls = changes.urlsToOpen.newValue;
        if (typeof urls != "undefined" && urls !== null && urls.length > 0) {
            var tabToHilite = [changes.currTab.newValue.index];
            var openAt = changes.currTab.newValue.index;
            var invokedWind = changes.invokedWindow.newValue;
            console.log("invoked from" + invokedWind + "\n urls-" + urls.length);
            if (!changes.opnSmeTb.newValue) {
                if (Array.isArray(urls)) {
                    openAt ++;
                    chrome.tabs.create({url: urls[0], active : !tabsBackground, index: parseInt(openAt), windowId : invokedWind}, function(tab){
                        tabToHilite.push(tab.index);
                        openAt ++;
                        //console.log(JSON.stringify(tab));
                        var firstPage = tab.id;
                        var lastTab = tab.id;
                        console.log("reset");
                        rotateIcon(true);
                        chrome.tabs.onRemoved.addListener(function (tabId , info) {
                            if (tabId === lastTab) {
                                chrome.storage.sync.set({loading: false}, function() {});
                                rotateIcon(false);
                            }
                        });

                        chrome.tabs.onUpdated.addListener(function(tabId , info) {
                            //console.log(tabId + "" + JSON.stringify(info));
                            //console.log("urls ln" + urls.length);
                            if (info.status === "complete"  && tabId === lastTab && urls.length > 1) {
                                //console.log("length" + urls.length);
                                chrome.tabs.update(firstPage, {active: true});
                                urls.shift();
                                chrome.tabs.create({url: urls[0], active : false, index: parseInt(openAt), windowId : invokedWind}, function(tab) {
                                    lastTab = tab.id;
                                    tabToHilite.push(tab.index);
                                    openAt ++;
                                });
                            }
                            if (info.status === "complete"  &&  tabId === lastTab && urls.length == 1) {
                                chrome.storage.sync.set({loading: false}, function() {});
                                rotateIcon(false);
                            }
                        });
                    });
                } else {
                    openAt ++;
                    chrome.tabs.create({url: urls, active : !tabsBackground, index: parseInt(openAt), windowId : invokedWind}, function(tab){
                        tabToHilite.push(tab.index);
                    });
                    chrome.storage.sync.set({loading: false}, function() {});
                }
            } else {
                chrome.tabs.update(changes.currTab.newValue.id, {url: urls[0]});
                chrome.storage.sync.set({loading: false}, function() {});
            }

            if (highlightTabs) {
                chrome.tabs.highlight({tabs: tabToHilite, windowId: invokedWind}, function(){
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                });
            }

        }
        chrome.storage.sync.set({urlsToOpen: [], currTab : "", invokedWindow : "", opnSmeTb : ""}, function() {});
    }
    if (chrome.runtime.error) {
        console.log("ddd Runtime error.");
    }

});

