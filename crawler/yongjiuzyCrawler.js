const S = require("string");
const http = require("request");
const cheerio = require("cheerio");
const yongjiuzyController = require("./../controller/crawler/yongjiuzyController");
/**
 * http://www.yongjiuzy.com/?m=vod-index-pg-1.html
 * 
 * 
 * /?m=vod-detail-id-1538.html
 */

const base_url = "http://www.yongjiuzy.com";
// const base_url = "http://www.35zy.com";

/**
 * 获取页面内的视频主题
 */
function getPageContent(currentPage, callback) {
    http(
        base_url + "/?m=vod-index-pg-" + currentPage + ".html",
        (error, response, body) => {
            if (error) {
                console.error(error);
                return;
            }
            let $ = cheerio.load(body);

            //获取每条item的基础信息
            $(".DianDian").each((index, el) => {
                let video_data = {};
                let item = $(el).find("td");
                let a = $(item[0]).find("a");
                video_data.video_id = S(a.attr("href")).between("id-", ".html").s;
                let tmp = a.text().split(" ");
                video_data.title = tmp[0];
                video_data.tag = S(tmp[1]).between("[", "]").s;
                video_data.type = $(item[1])
                    .text()
                    .trim();
                video_data.area = $(item[2])
                    .text()
                    .trim();
                video_data.state = $(item[3])
                    .text()
                    .trim();
                video_data.update_time = $(item[4])
                    .text()
                    .trim();
                //保存信息
                // getVideoDes(video_data.video_id);
                yongjiuzyController.saveVideoInfo(video_data, updateState => {
                    if (updateState) {
                        console.log(video_data.video_id + "===>update");
                        getVideoDes(video_data.video_id);
                    }
                });
            });

            let page_num = $(".page_num").text();
            let page = S(page_num).between("当前:", "页").s;
            if (typeof callback == "function") {
                callback(parseInt(page.split("/")[1]));
            }
        }
    );
}

function getVideoDes(id) {
    http(
        base_url + "/?m=vod-detail-id-" + id + ".html",
        (error, response, body) => {
            if (error) {
                console.error("getVideoDes===>" + error);
                yongjiuzyController.updateTag(id, true); //方便下次做更新
                return;
            }
            let $ = cheerio.load(body);
            let player_urls = [];

            //获取链接
            let link_el = $(".contentURL input");
            link_el.each((index, el) => {
                if (index !== link_el.length - 2 && index !== link_el.length - 1) {
                    let des = $(el)
                        .val()
                        .split("$");
                    let u = des[1].split("http")[1];
                    let url = "";
                    //处理视频暂缺的情况
                    if (u) {
                        url = "http" + u;
                    }
                    player_urls.push({
                        player_title: des[0],
                        player_url: url
                    });
                }
            });

            let addr = {
                video_id: id,
                player_urls: player_urls
            };

            //获取视频相关信息
            let video_data = {};
            let pic = $(".contentMain .videoPic img").attr("src");
            console.log(id + ":" + pic); //pic可能为undefined
            if (pic && !S(pic).contains("http")) {
                pic = base_url + pic;
            }
            let detail = $(".contentMain .videoDetail").text();
            let title = S(detail)
                .between("影片名称:", "影片别名")
                .s.trim();
            let alias = S(detail)
                .between("影片别名:", "影片备注")
                .s.trim();
            let actor = S(detail)
                .between("影片主演:", "影片导演")
                .s.trim();
            let director = S(detail)
                .between("影片导演:", "栏目分类")
                .s.trim();
            let year = S(detail)
                .between("上映年份:", "更新时间")
                .s.trim();
            let tag = S(detail)
                .between("影片备注:", "影片主演")
                .s.trim();
            let douban = S(detail)
                .between("豆瓣ID: ", " ")
                .s.trim();
            let synopsis = $(".contentNR")
                .text()
                .trim();

            video_data.video_id = id;
            video_data.title = title;
            video_data.alias = alias;
            video_data.actor = actor;
            video_data.director = director;
            video_data.year = year;
            video_data.tag = tag;
            video_data.douban = douban;
            video_data.pic = pic;
            video_data.synopsis = synopsis;
            video_data.update_tag = false;

            yongjiuzyController.saveVideoInfo(video_data);
            yongjiuzyController.savePlayerUrl(addr);

            // console.log(addr);
            // console.log(video_data);

        }
    );


}

function startCrawler() {
    getPageContent(1, function(maxPage) {
        for (let i = 2; i <= maxPage; i++) {
            getPageContent(i);
        }
    });
}

//处理urls为空的ID
function startUrlsIsNull(){
    yongjiuzyController.getUrlsIsNull(res=>{
        for (var i = 0; i < res.length; i++) {
            var doc = res[i];
            getVideoDes(doc.video_id);
        }
    })
}

// getPageContent(1);
// getVideoDes(2748);

// startCrawler();
// startUrlsIsNull();

exports.startCrawler = startCrawler;
exports.startUrlsIsNull = startUrlsIsNull;