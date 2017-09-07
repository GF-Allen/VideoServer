const express = require("express");
const router = express.Router();
const videoController = require("../controller/api/videoController");

router.get("/types", videoController.getTypes);
router.get("/types/:id", videoController.getTypeById);
router.get("/videos", videoController.getVideos);
router.get("/videos/:id", videoController.getVideoById);
router.get("/videos/:id/urls", videoController.getAddrByVideoId);

module.exports = router;