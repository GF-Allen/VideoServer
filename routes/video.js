const express = require("express");
const router = express.Router();
const video = require("../crawler/video");
const videoController = require("../controller/movieController");

/* 视频地址 */
router.get("/home/:type/:page", async function(req, res) {
  let typeId = req.params.type;
  let page = req.params.page;
  if (parseInt(typeId) > 4) {
    res.send({
      msg: "类型不对",
      code: "10001"
    });
  }
  try {
    let result = await videoController.findVideoByPage(typeId, page);
    res.send({
      code: 10000,
      result: result
    });
  } catch (error) {
    res.send({
      msg: "服务器异常",
      code: "10001"
    });
  }
});

/* 剧集地址 */
router.get("/lines/:id", async function(req, res) {
  let id = req.params.id;
  try {
    videoController.findVideoLinesByVideoId(id, async (err, dataRes) => {
      if (dataRes && dataRes.length != 0) {
        res.send({
          code: 10000,
          result: { line_data: dataRes }
        });
        //判断是否需要更新
        videoController.findVideoByVieoId(id, (err, res) => {
          if (res.update_line_tag) {
            console.log("需要更新");
            video.getVideoPlayerPath(id);
          }
        });
      } else {
        let result = await video.getVideoPlayerPath(id);
        res.send({
          code: 10000,
          result: result
        });
      }
    });
  } catch (err) {
    res.send({
      msg: "服务器异常",
      code: "10001"
    });
  }
});

router.get("/player/:videoid/:lineid", async function(req, res) {
  let videoid = req.params.videoid;
  let lineid = req.params.lineid;
  try {
    videoController.findLineById(videoid, lineid, async (err, data) => {
      if (!data.lines[0].video_player) {
        //插入更新
        let result = await video.getPlayerUrl(data.lines[0].video_path);
        videoController.updateLinePlayer(videoid, lineid, result);
        res.send({
          code: 10000,
          result: result
        });
      } else {
        res.send({
          code: 10000,
          result: data.lines[0].video_player
        });
      }
    });
  } catch (err) {
    res.send({
      msg: "服务器异常",
      code: "10001",
      err: err
    });
  }
});

router.get("/iframe",async function(req,res){
  
})

module.exports = router;
