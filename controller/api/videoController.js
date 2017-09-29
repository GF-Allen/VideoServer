/**
 * 以restful设计接口
 * 
 * ?limit=10：指定返回记录的数量
 * ?offset=10：指定返回记录的开始位置。
 * ?page=2&page_size=100：指定第几页，以及每页的数量。
 * ?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
 */

const constant = require("../../utils/constant");
const videoInfo = require("../../model/video_info");
const videoAddr = require("../../model/video_addr");

//过滤的字段
const video_filter = {
  _id: 0,
  update_time: 0,
  create_date: 0,
  __v: 0,
  update_tag: 0
};

class VideoController {
  constructor() {}

  //获取所有类型
  getTypes(req, res, next) {
    res.json({
      code: constant.RESULT_CODE.SUCCESS.code,
      msg: constant.RESULT_CODE.SUCCESS.msg,
      result: constant.TYPE_ALL
    });
  }

  //根据Id查找类型
  getTypeById(req, res, next) {
    let typeId = req.params.id - 1;
    res.json({
      code: constant.RESULT_CODE.SUCCESS.code,
      msg: constant.RESULT_CODE.SUCCESS.msg,
      result: constant.TYPE_ALL[typeId]
    });
  }

  /** 
   * 查找电影列表 ?type=xx&title=xx&area=xx&year=xxx
   * 模糊查询 title  actor
   */
  getVideos(req, res, next) {
    try {
      let typeId = req.query.type;
      let title = req.query.title;
      let area = req.query.area;
      let year = req.query.year;
      let actor = req.query.actor;
      let type = [];
      if (typeId) {
        typeId -= 1;
        if (typeId >= 0 && typeId <= constant.TYPE_ALL.length - 1) {
          if (typeId == 0 || typeId == 1) {
            let subs = constant.TYPE_ALL[typeId].subTypes;
            for (var i in subs) {
              var sub = subs[i];
              type.push(sub.name);
            }
          } else {
            type = constant.TYPE_ALL[typeId].name;
          }
        } else {
          res.json({
            code: constant.RESULT_CODE.ARG_ERROR.code,
            msg: "TypeId不正确"
          });
          return;
        }
      }
      let paging = handlePaging(req);

      let conditions = {
        type: type.length != 0 ? { $in: type } : { $ne: null },
        title: title ? { $regex: title } : { $ne: null },
        area: area ? area : { $ne: null },
        year: year ? year : { $ne: null },
        actor: actor ? { $regex: actor } : { $ne: null }
      };
      videoInfo
        .find(conditions, video_filter)
        .sort({ update_time: "desc" }) //按更新时间降序
        .skip(paging.start)
        .limit(paging.pageSize)
        .exec((err, data) => {
          handleData(err, res, data);
        });
    } catch (error) {
      handleError(error, res);
    }
  }

  //根据视频Id查找视频
  getVideoById(req, res, next) {
    try {
      let id = req.params.id;
      videoInfo.findOne({ video_id: id }, video_filter, (err, data) => {
        handleData(err, res, data);
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  //查询播放地址
  getAddrByVideoId(req, res, next) {
    try {
      let id = req.params.id;
      let infoPromise = videoInfo
        .findOne({ video_id: id }, video_filter)
        .exec();
      let addrPromise = videoAddr.findOne({ video_id: id }, { _id: 0 }).exec();
      Promise.all([infoPromise, addrPromise])
        .then(datas => {
          if (datas[0]) {
            let data = datas[0]._doc; //_doc才能添加model以外的属性
            data.player_urls = datas[1].player_urls;
            for (var index = 0; index < data.player_urls.length; index++) {
              var element = data.player_urls[index];
              delete data.player_urls[index]._doc["_id"];
            }
            res.json({
              code: constant.RESULT_CODE.SUCCESS.code,
              msg: constant.RESULT_CODE.SUCCESS.msg,
              result: data
            });
          } else {
            res.json({
              code: constant.RESULT_CODE.NOT_FOUND,
              msg: "未查询到该ID"
            });
          }
        })
        .catch(err => {
          handleError(err, res);
        });
    } catch (error) {
      handleError(error, res);
    }
  }

  //查询所有的年份
  getAllYears(req, res, next) {
    videoInfo.distinct("year", (err, result) => {
      handleData(err, res, result);
    });
  }

  getAllAreas(req, res, next) {
    videoInfo.distinct("area", (err, result) => {
      handleData(err, res, result);
    });
  }
}

//处理分页
function handlePaging(req) {
  let page = parseInt(req.query.page);
  let tmpSize = req.query.page_size;
  let pageSize = tmpSize == undefined ? 50 : parseInt(tmpSize);
  let start = 0;
  if (page) {
    start = (page - 1) * pageSize;
  } else {
    pageSize = null;
  }
  return {
    start: start,
    pageSize: pageSize
  };
}

//处理异常
function handleError(error, res) {
  console.error(error);
  res.json({
    code: constant.RESULT_CODE.INTERNAL_ERROR.code,
    msg: constant.RESULT_CODE.INTERNAL_ERROR.msg
  });
}

//处理数据
function handleData(err, res, data) {
  if (err) {
    console.error(err);
    res.json({
      code: constant.RESULT_CODE.FAILD.code,
      msg: "db faild"
    });
  } else {
    res.json({
      code: constant.RESULT_CODE.SUCCESS.code,
      msg: constant.RESULT_CODE.SUCCESS.msg,
      result: data
    });
  }
}

module.exports = new VideoController();
