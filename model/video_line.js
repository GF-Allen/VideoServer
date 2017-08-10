
/**
 * 每一个线路对应的集数
 */

const dbHelper = require("../dbhelper/db");

var movieSchema = new dbHelper.Schema(
  {
    title: String,
    home_path: String,
    movie_id: String,
    type: String,
    tag: String, //标记更新进度
    actors: String,
    movie_type: String,
    year: String,
    area: String,
    create_date: { type: Date, default: Date.now }
  },
  {
    collection: "video_home"
  }
);

const Movie = dbHelper.db.model("video_home", movieSchema);

module.exports = Movie;
