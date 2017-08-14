/**
 * 视频的主页信息
 */

const dbHelper = require("../dbhelper/db");

var movieSchema = new dbHelper.Schema(
  {
    title: String,
    home_path: String,
    movie_id: String,
    type: String,
    tag: String, //标记更新进度
    update_line_tag: { type: Boolean, default: false }, //是否有更新
    actors: String,
    movie_type: String,
    year: String,
    area: String,
    synopsis: String, //剧情简介
    cover_img: String, //封面图片
    create_date: { type: Date, default: Date.now }
  },
  {
    collection: "video_home"
  }
);

const Movie = dbHelper.db.model("video_home", movieSchema);

module.exports = Movie;
