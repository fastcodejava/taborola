var jsonObj = {};
//jsonObj["current"] = "search";
//jsonObj["description"] = "google search";
var sites = [];
var queryString;

//google
$("div.srg").find("h3 > a").each(function (index) {
    console.log("Title: " + this.text);
    //$(this).append("<br><span style='color: orange'>My new line text</span>");
    console.log('me done');
    var obj = {};
    obj[this.text] = $(this).attr('href');
    sites.push(obj);

});
//bing //ol.b_results
$("ol#b_results > li.b_algo").find("h2 > a").each(function () {
    console.log("Title: " + this.text);
    var lnk = $(this).attr('href');
    console.log("from: " + JSON.stringify(lnk));
    var obj = {};
    obj[this.text] = $(this).attr('href');
    sites.push(obj);
});
//yahoo
$("div#web").find("h3 > a").each(function () {
    console.log("Title: " + this.text);
    var lnk = $(this).attr('href');
    console.log("from: " + JSON.stringify(lnk));
    var obj = {};
    obj[this.text] = $(this).attr('href');
    sites.push(obj);
});
jsonObj['sites'] = sites;

if (location.origin.indexOf('yahoo') > -1) {
    queryString = document.getElementsByName("p")[0].value;
} else {
    queryString = document.getElementsByName("q")[0].value;
}
//var queryString = document.getElementsByName("q")[0].value; //"p" for yahoo
/*console.log("jjjjj" + queryString);
console.log(location.pathname);
console.log(location.href);
console.log(location.host);
console.log(location.hostname);
console.log(location.pathname);
console.log(location.origin);*/
//var urlquery = '';
//urlquery = location.origin + location.pathname + '?q=' + queryString;
console.log("Final object...\n" + JSON.stringify(jsonObj));
chrome.storage.sync.set({'googleSearch': sites, 'queryString' : queryString, 'searchEngine' : location.origin}, function() {
    console.log('Settings saved');
});

var fromGS = {};
$("div.srg").find("h3 > a").click(function () {
    fromGS = $(this).attr('href');
    console.log("from: " + JSON.stringify(fromGS));

});

$('a').click(function(){
    //alert('u r going to ' + $(this).attr('href') + '..jst li dt..');
});

var urlArr = [];
$('a').each(function(){
    urlArr.push($(this).attr('href'));
    //alert('u r going to ' + $(this).attr('href') + '..jst li dt..');
});
console.log("showing..\n" + urlArr);

//chrome.runtime.sendMessage({todo: "show_text"});

chrome.runtime.onMessage.addListener(function(req, sender, sendres){
    console.log("in lsner lll");
    /*if (request.greeting == "hello")*/
    var url = new URL(location.origin);
    var name = url.hostname.split('.')[1];
    //if (req.highlight) {
    //alert(req.selectedItems);
    console.log("in lsner" + req.selectedItems);

    if (name === 'google') {
        highlightTextG(req.selectedItems, req.highlight);
    } else if (name === 'yahoo') {
        highlightTextY(req.selectedItems, req.highlight);
    } else if (name === 'bing') {
        highlightTextB(req.selectedItems, req.highlight);
    }
    /*} else {
        if (name === 'google') {
            removeHighlightG(req.selectedItems);
        } else if (name === 'yahoo') {
            removeHighlightY(req.selectedItems);
        } else if (name === 'bing') {
            removeHighlightB(req.selectedItems);
        }

    }*/
    //sendResponse({farewell: "goodbye"});
});

function highlightTextG(selectedItems, highlight) {

    console.log("in highlight");

    $("div.srg").find("h3 > a").each(function (index) {
        if(selectedItems === $(this).attr('href')) {
            if (highlight) {
                $(this.parentNode.nextSibling).css("background-color","#E2DDDD");
            } else {
                $(this.parentNode.nextSibling).css("background-color","");
            }

            console.log($(this));
            console.log($(this.parentNode.nextSibling));
        }
    });
}


function highlightTextY(selectedItems, highlight) {

    console.log("in highlight");
    $("div#web").find("h3 > a").each(function () {
        if(selectedItems === $(this).attr('href')) {
            if (highlight) {
                $(this.parentNode.parentNode.nextSibling.nextSibling).css("background-color","#E2DDDD");
            } else {
                $(this.parentNode.parentNode.nextSibling.nextSibling).css("background-color","");
            }
            console.log($(this));
            console.log($(this.parentNode.parentNode.nextSibling.nextSibling));
        }

    });

}

function highlightTextB(selectedItems, highlight) {

    console.log("in highlight");
    $("ol#b_results > li.b_algo").find("h2 > a").each(function () {
        if(selectedItems === $(this).attr('href')) {
            console.log($(this));
            console.log($(this.parentNode.nextSibling));
            if (highlight) {
                $(this.parentNode.parentNode).find("div.b_caption").css("background-color","#E2DDDD");
            } else {
                $(this.parentNode.parentNode).find("div.b_caption").css("background-color","");
            }

        }

    });

}