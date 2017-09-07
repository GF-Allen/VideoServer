const express = require("express");
const router = express.Router();
const videoController = require("../controller/api/videoController");

router.get("/types", videoController.getTypes);
router.get("/types/:id", videoController.getTypeById);
router.get("/videos", videoController.getVideos);
router.get("/videos/:id", videoController.getVideoById);

//模板
router.get("", (req, res, next) => {
  let typeId = req.params.id;
  res.send({
    code: 10000,
    msg: "success",
    result: constant.TYPE_MENU[typeId]
  });
});

module.exports = router;
