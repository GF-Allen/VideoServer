const asyncTool = require("async");
const video = require("./video");
const S = require("string");

var threadCount = 0;

// (async function() {
//   let result = await video.getHomePathByType("1");
//   console.log(result);
// })();

function fetchUrl(url, callback) {
  var delay = parseInt(Math.random() * 10000000 % 2000, 10);
  threadCount++;
  console.log("现在的并发数是", threadCount, "，正在抓取的是", url);
  setTimeout(function() {
    threadCount--;
    let err;
    if (S(url).contains("2")) {
      err = "2";
    } 
    callback(err, url + "html内容");
  }, delay);
}

var urls = [];
for (var i = 0; i < 30; i++) {
  urls.push("http://datasource_" + i);
}

asyncTool.mapLimit(
  urls,
  5,
  function(url, callback) {
    fetchUrl(url, callback);
  },
  function(err, result) {
    console.log("final:");
    console.log(err);
    console.log(result);
  }
);
