/**
 * Created by gdev on 3/19/2017.
 */
chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event received for message: ', command);

    chrome.tabs.getCurrent( function(tab) {
            var url = tab.url;

            var start = url.indexOf('http://');
            if (start < 0) {
                start = url.indexOf('https://');
            }
            chrome.storage.sync.get('tabsBackground', function(items) {

                var ind = url.indexOf('/', start + 10);
                if (ind !== -1) {
                    var baseurl = url.substring(start, ind);
                    if (baseurl !== url) {
                        chrome.tabs.create({url: baseurl, selected: !items.tabsBackground, index: (tab.index + 1)});
                    }
                }
            });
        }
    );
});
