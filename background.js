/**
 * Created by gdev on 3/19/2017.
 */
var highlightTabs;
var tabsBackground;
var currWindow;

var options = ['tabsBackground', 'highlightTabs'];

chrome.storage.sync.get( options, function(items) {
    highlightTabs = items.highlightTabs;
    tabsBackground = items.tabsBackground;
});
chrome.windows.getCurrent(function(win){
    currWindow = win.id;
});

chrome.storage.sync.get(function(data) {
    console.log("data sync " + JSON.stringify(data));
});
chrome.storage.onChanged.addListener(function(changes, area) {
    console.log("in bkgd page" + JSON.stringify(changes));
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
                        chrome.tabs.onUpdated.addListener(function(tabId , info) {
                            //console.log(tabId + "" + JSON.stringify(info));
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
                        });
                    });
                } else {
                    openAt ++;
                    chrome.tabs.create({url: urls, active : !tabsBackground, index: parseInt(openAt), windowId : invokedWind}, function(tab){
                        tabToHilite.push(tab.index);
                    });
                }
            } else {
                chrome.tabs.update(changes.currTab.newValue.id, {url: urls[0]});
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

chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event received for message: ', command);


});
