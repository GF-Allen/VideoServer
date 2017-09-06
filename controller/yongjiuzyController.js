const infoModel = require("../model/video_info");
const addrModel = require("../model/video_addr");

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
            console.log(info.video_id + "插入成功");
          }
          if (typeof callback == "funcotion") {
            callback(true); //返回是否需要更新
          }
        });
      } else {
        //表中的更新时间和爬取的不一致，则需要更新
        if (res.update_time != info.update_time) {
          info.update_tag = true;
        }
        infoModel.update({ _id: res._id }, info, (err, res) => {
          console.log(info.video_id, "更新成功");
        });
        if (typeof callback == "funcotion") {
          callback(info.update_tag); //返回是否需要更新
        }
      }
    }
  });
}

function updateTag(id, tag) {
    infoModel.findOne({ video_id: info.video_id }, (err, res)=>{
        if(err){
            console.error(err);
        }else{
            infoModel.update({ _id: res._id },{
                update_tag = tag
            }, (err, res)=>{})
        }
    })
}

function savePlayerUrl(addr) {
  addrModel.findOne({ video_id: addr.video_id }, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      if (!res) {
        addrModel.update({ _id: res._id }, addr, (err, res) => {
            updateTag(addr.video_id,false)
        });
      } else {
        addrModel.create(addr, (err, res) => {
            updateTag(addr.video_id,false);
        });
      }
    }
  });
}

exports.saveVideoInfo = saveVideoInfo;
exports.savePlayerUrl = savePlayerUrl;
