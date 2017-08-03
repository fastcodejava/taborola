var jsonObj = {};
//jsonObj["current"] = "search";
//jsonObj["description"] = "google search";
var sites = [];

$("div.srg").find("h3 > a").each(function (index) {
    console.log("Title: " + this.text);
    //$(this).append("<br><span style='color: orange'>My new line text</span>");
    console.log('me done');
    var obj = {};
    obj[this.text] = $(this).attr('href');
    sites.push(obj);

});
jsonObj['sites'] = sites;

var queryString = document.getElementsByName("q")[0].value;
console.log("jjjjj" + queryString);
console.log(location.pathname);
console.log(location.href);
console.log("Final object...\n" + JSON.stringify(jsonObj));
chrome.storage.sync.set({'googleSearch': sites, 'queryString' : location.href}, function() {
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