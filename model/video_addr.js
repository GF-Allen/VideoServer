/**
 * 播放地址
 */

const dbHelper = require("../dbhelper/db");

var Schema = new dbHelper.Schema(
  {
    video_id: String,
    player_urls: [
      {
        player_title: String,
        player_url: String,
      }
    ],
    create_date: { type: Date, default: Date.now }
  },
  {
    collection: "video_addr"
  }
);

const model = dbHelper.db.model("video_addr", Schema);

module.exports = model;
