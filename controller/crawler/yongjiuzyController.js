const infoModel = require("../../model/video_info");
const addrModel = require("../../model/video_addr");

function saveVideoInfo(info, callback) {
    infoModel.findOne({ video_id: info.video_id }, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            if (!res) {
                infoModel.create(info, (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // console.log(info.video_id + "插入成功");
                    }
                    if (typeof callback == "function") {
                        callback(true); //返回是否需要更新
                    }
                });
            } else {
                //表中的更新时间和爬取的不一致，则需要更新
                if (res.update_time != info.update_time || res.update_tag) {
                    info.update_tag = true;
                }
                infoModel.update({ _id: res._id }, info, (err, res) => {
                    //   console.log(info.video_id, "更新成功");
                });
                if (typeof callback == "function") {
                    callback(info.update_tag); //返回是否需要更新
                }
            }
        }
    });
}

function updateTag(id, tag) {
    infoModel.findOne({ video_id: id }, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            infoModel.update({ _id: res._id }, {
                    update_tag: tag
                },
                (err, res) => {}
            );
        }
    });
}

function savePlayerUrl(addr) {
    addrModel.findOne({ video_id: addr.video_id }, (err, res) => {
        if (err) {
            console.error(err);
            updateTag(addr.video_id, true);
        } else {
            if (res) {
                //移除后重新创建
                addrModel.remove({ _id: res._id }, (err) => {
                    addrModel.create(addr, (err, res) => {
                        updateTag(addr.video_id, false);
                    });
                })
            } else {
                addrModel.create(addr, (err, res) => {
                    updateTag(addr.video_id, false);
                });
            }
        }
    });
}

exports.saveVideoInfo = saveVideoInfo;
exports.savePlayerUrl = savePlayerUrl;
exports.updateTag = updateTag;