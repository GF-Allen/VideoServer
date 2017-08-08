const express = require('express');
const router = express.Router();
const video = require('../crawler/video');

/* 视频地址 */
router.get('/home/:type/:page', async function (req, res) {
    let typeId = req.params.type;
    let page = req.params.page;
    console.log(typeId, page);
    if (parseInt(typeId) > 4) {
        res.send({
            msg: '类型不对',
            code: '10001'
        });
    }
    try {
        let result = await video.getHomePathByType(typeId, page);
        res.send({
            code: 10000,
            result: result
        })
    } catch (err) {
        res.send({
            msg: '服务器异常',
            code: '10001'
        });
    }

});

/* 剧集地址 */
router.get('/ids/:id', async function (req, res) {
    let id = req.params.id;
    try {
        let result = await video.getVideoPlayerPath(id);
        res.send({
            code: 10000,
            result: result
        })
    } catch (err) {
        res.send({
            msg: '服务器异常',
            code: '10001'
        });
    }

});

router.get('/player',async function (req,res) {
    let path = req.param("path");
    try {
        let result = await video.getPlayerUrl(path);
        res.send({
            code: 10000,
            result: result
        })
    } catch (err) {
        res.send({
            msg: '服务器异常',
            code: '10001'
        });
    }
})

module.exports = router;