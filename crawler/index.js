const asyncTool = require("async");
const video = require("./video");
const video_home = require("../model/video_home");

const asyncCount = 8;
var threadCount = 0;

(async function() {
  let typeId = "2";
  let start = Date.now();
  let result = await video.getHomePathByType(typeId, "1");
  //TODO 遍历第一页，判断数据库中是否有未插入的数据，如果数据库中第一页的数据，则不跑后面的页，默认之后的数据已添加到库中
  let pagenow = parseInt(result.pagenow);
  let pagemax = parseInt(result.pagemax);
  let pages = [];
  for (var i = 2; i <= pagemax; i++) {
    pages.push(i);
  }

  asyncTool.mapLimit(
    pages,
    asyncCount,
    async function(page, callback) {
      let data = await video.getHomePathByType(typeId, page);
      if (!data) {
        console.log(page + "获取失败", 尝试重试);
        data = await video.getHomePathByType(typeId, page);
      }
      callback(null, data);
    },
    function(err, result) {
      let time = Date.now() - start;
      console.log("获取所有该类型的视频主页完成:" + time);
      video_home.find({ type: typeId }, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          fecthVideoPath(res);
        }
      });
      // console.log(result);
      //bug少了第一页的30条数据
      // fecthVideoPath(result);
    }
  );
})();

function fecthVideoPath(data) {
  let ids = [];
  for (var index in data) {
    let item = data[index];
    ids.push(item.movie_id);
  }

  console.log(`一共` + ids.length + "记录");

  asyncTool.mapLimit(
    ids,
    asyncCount,
    async function(id, callback) {
      threadCount++;
      console.log("当前：" + threadCount);
      let data = await video.getVideoPlayerPath(id);
      // fecthPlayerPath(data);
      // console.log(data);
      callback(null, data);
    },
    function(err, result) {
      console.log("获取所有视频的所有路线完成:", result.length);
      // console.log(result);
    }
  );
}

function fecthPlayerPath(data) {
  let urls = [];
  for (var index in data) {
    let item = data[index];
    let item_data = item.lines;
    for (var key in item_data) {
      let element = item_data[key];
      urls.push(element.path);
    }
  }

  console.log(`一共` + urls.length + "记录");

  asyncTool.mapLimit(
    urls,
    asyncCount,
    async function(url, callback) {
      let data = await video.getPlayerUrl(url);
      console.log(data);
      callback(null, data);
    },
    function(err, result) {
      console.log("获取所有视频的播放地址完成:", result.length);
      // console.log(result);
    }
  );
}
