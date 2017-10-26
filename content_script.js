var jsonObj = {};
//jsonObj["current"] = "search";
//jsonObj["description"] = "google search";
var sites = [];
var queryString;
var hrefAdded = [];
//google
$("div#rso > div._NId:first").find("div.g").find("div.rc").find("h3 > a").each(function (index) {
    console.log("Title: " + this.text);
    console.log($(this));
    //$(this).append("<br><span style='color: orange'>My new line text</span>");
    console.log('me done');
    var obj = {};

    obj[this.text] = $(this).attr('href');
    sites.push(obj);
    hrefAdded.push($(this).attr('href'));


});

$("div#rso").find("div > g-section-with-header").find("h3").find("a").each(function (index) {
    console.log("Title: " + this.text);
    console.log($(this));
    //$(this).append("<br><span style='color: orange'>My new line text</span>");
    console.log('me done');
    var obj = {};
    if (hrefAdded.indexOf($(this).attr('href')) === -1) {
        obj[this.text] = $(this).attr('href');
        sites.push(obj);
    }


});

$("div.srg").find("h3 > a").each(function (index) {
    console.log("Title: " + this.text);
    console.log($(this));
    //$(this).append("<br><span style='color: orange'>My new line text</span>");
    console.log('me done');
    var obj = {};
    if (hrefAdded.indexOf($(this).attr('href')) === -1) {
        obj[this.text] = $(this).attr('href');
        sites.push(obj);
    }

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

//youtube //find("ytd-video-renderer")
$("div#contents").find("h3 > a").each(function (index) {
    console.log("Title: " + this.text);
    console.log($(this));
    //$(this).append("<br><span style='color: orange'>My new line text</span>");
    console.log('me done');
    var obj = {};
    if (hrefAdded.indexOf($(this).attr('href')) === -1) {
        obj[this.text] = location.origin + $(this).attr('href');
        sites.push(obj);
    }

    //div#title-wrapper
});
jsonObj['sites'] = sites;
if (location.origin.indexOf('yahoo') > -1) {
    queryString = document.getElementsByName("p")[0].value;
} else if (location.origin.indexOf('youtube') > -1) {
    queryString = document.getElementsByName("search_query")[0].value;
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
    console.log("in lsner lll" + location.origin);
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
    } else if (name === 'youtube') {
        highlightTextYT(req.selectedItems, req.highlight);
    }

});

function highlightTextG(selectedItems, highlight) {

    console.log("in highlight");
    //$("div.srg").find("h3 > a").each(function (index) {
    $("div#rso > div._NId:first").find("div.g").find("div.rc").find("h3 > a").each(function (index) {
        //console.log("in first search.." + selectedItems);
        //console.log("in first search.." + $(this).attr('href'));
        if(selectedItems === $(this).attr('href')) {
            if (highlight) {
                //console.log("going to highlight,,,");
                $(this.parentNode.nextSibling).css("background-color","#E2DDDD");
            } else {
                //console.log("going to de highlight,,,");
                $(this.parentNode.nextSibling).css("background-color","");
            }

            console.log($(this));
            console.log($(this.parentNode.nextSibling));
        }
    });

    $("div#rso").find("div > g-section-with-header").find("h3").find("a").each(function (index) {
        console.log("in 2nd search..");
        if(selectedItems === $(this).attr('href')) {
            if (highlight) {
                $("div#rso").find("div > g-section-with-header").css("background-color","#E2DDDD");

                //$(this.parentNode.nextSibling).css("background-color","#E2DDDD");
            } else {
                $("div#rso").find("div > g-section-with-header").css("background-color","");
            }

            console.log($(this));
            console.log($("div#rso").find("div > g-section-with-header > g-scrolling-carousel"));
        }

    });
    $("div.srg").find("h3 > a").each(function (index) {
        console.log("in 3rd search..");
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

function highlightTextYT(selectedItems, highlight) {

    console.log("in highlight" + selectedItems);
    $("div#contents").find("ytd-video-renderer").find("h3 > a").each(function (index) {
        console.log($(this).attr('href'));
        if(selectedItems.indexOf($(this).attr('href')) > -1) {
            console.log($(this));
            console.log($(this.parentNode.nextSibling));
            console.log($(this.parentNode.parentNode));
            if (highlight) {
                $(this.parentNode.parentNode).css("background-color","#E2DDDD");
            } else {
                $(this.parentNode.parentNode).css("background-color","");
            }

        }

    });

}