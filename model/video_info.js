/**
 * 视频的主页信息
 */

const dbHelper = require("../dbhelper/db");

var Schema = new dbHelper.Schema({
    video_id: String, //id
    title: String, //名称
    alias: String, //别名
    tag: String, //标记
    type: String, //剧情类型
    synopsis: String, //简介
    actor: String, //主演
    director: String, //导演
    year: String, //年份
    area: String, //地域
    state: String, //状态
    douban: String, //豆瓣评分
    update_time: String, //更新时间
    update_tag: { type: Boolean, default: true }, //是否需要更新
    create_date: { type: Date, default: Date.now }
}, {
    collection: "video_info"
});

const model = dbHelper.db.model("video_info", Schema);

module.exports = model;