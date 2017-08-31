const phantom = require("phantom");
const S = require("string");
const movieController = require("../controller/movieController");
const video_home = require("../model/video_home");

/**
 * 获取类型的所有视频项
 * @param {*} url
 *
 * http://www.rejuwang.com/?m=vod-type-id-1-pg-1.html 电影
 * http://www.rejuwang.com/?m=vod-type-id-2-pg-1.html 电视剧
 * http://www.rejuwang.com/?m=vod-type-id-3-pg-1.html 综艺
 * http://www.rejuwang.com/?m=vod-type-id-4-pg-1.html 动漫
 *
 */

/**
 * 构建类型Url
 * @param type
 * @param page
 * @returns {string}
 */
function makeTypeUrlForTypeAndPage(type, page) {
  return (
    "http://www.rejuwang.com/?m=vod-type-id-" + type + "-pg-" + page + ".html"
  );
}

/**
 * 构建视频主页Url
 * @param id
 * @returns {string}
 */
function makeVideoHomePathById(id) {
  return "http://www.rejuwang.com/?m=vod-detail-id-" + id + ".html";
}

/**
 * 查找每个视频的主页地址
 * @type {getHomePathByType}
 */
exports.getHomePathByType = getHomePathByType;

function getHomePathByType(type, p) {
  return new Promise(async function(resolve, reject) {
    try {
      let url = makeTypeUrlForTypeAndPage(type, p);
      let instance = await phantom.create();
      let page = await instance.createPage();
      page.setting.resourceTimeout = 5 * 1000;
      let status = await page.open(url);

      if (status !== "success") {
        console.log("getHomePathByType:访问失败:" + status);
        await page.close();
        await instance.exit();
        reject(status);
      } else {
        let result = await page.evaluate(function() {
          var data = new Array();
          $(".link-hover").each(function() {
            var href = $(this).attr("href");
            var id = href.split("-id-")[1].split(".html")[0];
            var tag = $(this)
              .find("p.other")
              .text();
            var info = $(this).find(".lzbz p");
            var title = info[0].innerText;
            var actors = info[1].innerText;
            var movie_type = info[2].innerText;
            var yearAndArea = info[3].innerText.split("/");
            var year = yearAndArea[0];
            var area = yearAndArea[1];
            var cover_img = $(this)
              .find("img.lazy")
              .attr("data-original");
            data.push({
              movie_id: id,
              title: title,
              home_path: href,
              tag: tag,
              actors: actors,
              movie_type: movie_type,
              year: year,
              area: area,
              cover_img: cover_img
            });
          });

          var nowAndMax = $("div.page.mb.clearfix")
            .text()
            .split("当前:")[1]
            .split("页")[0]
            .split("/");

          var pagenow = nowAndMax[0];
          var pagemax = nowAndMax[1];

          return {
            pagemax: pagemax,
            pagenow: pagenow,
            data: data
          };
        });

        for (let index in result.data) {
          let item = result.data[index];
          item.type = type;
          movieController.saveVideoHome(item);
        }
        await page.close();
        await instance.exit();
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 获取具体线路播放路径
 */
exports.getVideoPlayerPath = getVideoPlayerPath;

function getVideoPlayerPath(id) {
  return new Promise(async function(resolve, reject) {
    let url = makeVideoHomePathById(id);
    let instance = await phantom.create();
    let page = await instance.createPage();
    page.setting.resourceTimeout = 5 * 1000;
    let status = await page.open(url);
    if (status !== "success") {
      console.log("getVideoPlayerPath:访问失败:" + status);
      await page.close();
      await instance.exit();
      reject(status);
    } else {
      let result = await page.evaluate(function() {
        var line_data = new Array();
        var movie_id = $(".main .title a")
          .last()
          .attr("href")
          .split("-id-")[1]
          .split(".html")[0];
        $(".playfrom li").each(function() {
          var lineId = $(this).attr("id"); //线路Id
          var lineName = $(this)
            .text()
            .trim();
          var lines = new Array();
          $("#s" + lineId + " li").each(function() {
            var name = $(this)
              .find("a")
              .text();
            var path = $(this)
              .find("a")
              .attr("href");
            lines.push({
              video_name: name,
              video_path: path
            });
          });
          line_data.push({
            line_name: lineName,
            movie_id: movie_id,
            lines: lines
          });
        });
        var synopsis = $("div.ee .js").text(); //剧情简介
        return { line_data: line_data, synopsis: synopsis };
      });
      for (var key in result.line_data) {
        var data = result.line_data[key];
        movieController.saveVideoLineByVideoId(data);
      }
      video_home.update(
        { movie_id: id },
        { synopsis: result.synopsis },
        { update_line_tag: false },
        (err, rea) => {}
      );
      await page.close();
      await instance.exit();
      resolve(result);
    }
  });
}

/**
 * 获取播放路径
 */
exports.getPlayerUrl = getPlayerUrl;

function getPlayerUrl(url) {
  return new Promise(async function(resolve, reject) {
    url = "http://www.rejuwang.com" + url;
    let instance = await phantom.create();
    let page = await instance.createPage();
    let status = await page.open(url);

    if (status !== "success") {
      console.log("getPlayerUrl:访问失败:" + status);
      await page.close();
      await instance.exit();
      reject(status);
    } else {
      let result = await page.evaluate(function() {
        var data = $("#playleft iframe").attr("src");
        return data;
      });
      if (!S(result).contains("http")) {
        result = "http://www.rejuwang.com" + result;
      }

      await page.close();
      await instance.exit();
      resolve(result);
    }
  });
}
