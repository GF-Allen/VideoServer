
/**
 * 每一个线路对应的集数
 */

const dbHelper = require("../dbhelper/db");

var lineSchema = new dbHelper.Schema(
  {
    lineName: String,
    videoId:String,
    lines:[
      {
        name:String,
        path:String
      }
    ],
    create_date: { type: Date, default: Date.now }
  },
  {
    collection: "video_line"
  }
);

const VideoLine = dbHelper.db.model("video_line", lineSchema);

module.exports = VideoLine;
