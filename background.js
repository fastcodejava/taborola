/**
 * Created by gdev on 3/19/2017.
 */
var highlightTabs;
var tabsBackground;

var options = ['tabsBackground', 'highlightTabs'];

chrome.storage.sync.get( options, function(items) {
    highlightTabs = items.highlightTabs;
    tabsBackground = items.tabsBackground;
});

chrome.storage.onChanged.addListener(function(changes, area) {
    console.log("in bkgd page" + JSON.stringify(changes));
    if (area == "sync" && "urlsToOpen" in changes) {
        var urls = changes.urlsToOpen.newValue;
        console.log(typeof urls != "undefined");
        console.log(urls != null);
        console.log(urls.length);
        if(typeof urls != "undefined" && urls != null && urls.length > 0){
            var currTab;
            var tabToHilite = [changes.currTab.newValue.index];
            var openAt = changes.currTab.newValue.index;
            if (!changes.opnSmeWin.newValue) {
                openAt ++;
                chrome.tabs.create({url: urls[0], active : !tabsBackground, index: parseInt(openAt)}, function(tab){
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
                            chrome.tabs.create({url: urls[0], active : false, index: parseInt(openAt)}, function(tab) {
                                lastTab = tab.id;
                                tabToHilite.push(tab.index);
                                openAt ++;
                            });
                        }
                    });
                });
            } else {
                chrome.tabs.update(changes.currTab.newValue.id, {url: urls[0]});
            }

            if (highlightTabs) {
                chrome.tabs.highlight({"tabs": tabToHilite}, function(){
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                });
            }

        }
        chrome.storage.sync.set({"urlsToOpen": [], "currTab" : "", "opnSmeWin" : ""}, function() {});

    }

});

chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event received for message: ', command);


});
