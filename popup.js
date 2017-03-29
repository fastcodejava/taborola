/**
 *
 * Created by gdev on 3/29/2017.
 */
var urls = {
    link1: 'http://www.amazon.in/books',
    link2: 'http://www.amazon.in/kitchen',
    link3: 'http://www.amazon.in/Grocery',
    link4: 'http://www.amazon.in/mobile-phones'
};

function clickHandler(e) {
    // var link1 = document.getElementById('link1');
    var links = document.getElementsByName('link');

    links.forEach(function (link) {
        if (link.checked)
            chrome.tabs.create ({url : urls[link.id]});
    });

    chrome.tabs.executeScript({code : "var selectedPages = 'krish';"},
        function (result) {
            chrome.tabs.executeScript({file : "openSelectedPages.js"}, function(result){});
        });

    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('openbtn').addEventListener('click', clickHandler);
    var links = document.getElementsByName('link');

    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            document.getElementById('openbtn').disabled = false;
        });
    });
});
