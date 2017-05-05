/**
 * Created by gdev on 3/19/2017.
 */
var highlightTabs;
var tabsBackground;

var options = ['tabsBackground', 'highlightTabs']

chrome.storage.sync.get( options, function(items) {
    highlightTabs = items.highlightTabs;
    tabsBackground = items.tabsBackground;
});

chrome.storage.onChanged.addListener(function(changes, area) {
    console.log("in bkgd page" + JSON.stringify(changes));
    if (area == "sync" && "urlsToOpen" in changes) {
        var currTab;
        var tabToHilite = [changes.currTab.newValue.index];
        var openAt = changes.currTab.newValue.index + 1;
        var urls = changes.urlsToOpen.newValue;
        chrome.tabs.create({url: urls[0], active : !tabsBackground, index: openAt}, function(tab){
            tabToHilite.push(tab.index);
            openAt ++;
            //console.log(JSON.stringify(tab));
            var firstPage = tab.id;
            var lastTab = tab.id;
            chrome.tabs.onUpdated.addListener(function(tabId , info) {
                //console.log(tabId + "" + JSON.stringify(info));
                if (info.status == "complete" && tabId === lastTab && urls.length > 1) {
                    //console.log("length" + urls.length);
                    chrome.tabs.update(firstPage, {active: true});
                        urls.shift();
                        chrome.tabs.create({url: urls[0], active : false, index: openAt}, function(tab) {
                            lastTab = tab.id;
                            tabToHilite.push(tab.index);
                            openAt ++;
                        });
                        //console.log("after shift" + urls);
                        // urls.forEach(function(page) {
                        //     //console.log(page);
                        //     chrome.tabs.create({url: page, active : !tabsBackground, index: openAt}, function(tab){
                        //         tabToHilite.push(tab.index);
                        //         openAt ++;
                        //     });
                        // });
                    //console.log("i m complete");
                }
            });
        });
        /*urls.forEach(function (url) {
         console.log(url);





         });*/
        if (highlightTabs) {
            chrome.tabs.highlight({tabs: tabToHilite}, function(){});
        }

        chrome.storage.sync.set({"urlsToOpen": [], currTab : ""}, function() {
        });

    }

});

chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event received for message: ', command);


});
