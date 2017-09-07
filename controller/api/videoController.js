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
      code: constant.RESULT_CODE.SUCCESS,
      msg: "success",
      result: constant.TYPE_MENU
    });
  }

  //根据Id查找类型
  getTypeById(req, res, next) {
    let typeId = req.params.id;
    res.json({
      code: constant.RESULT_CODE.SUCCESS,
      msg: "success",
      result: constant.TYPE_MENU[typeId]
    });
  }

  //根据类型查找电影列表
  getVideos(req, res, next) {
    try {
      let typeId = req.query.type_id;
      let type = constant.TYPE_MENU[typeId];
      let paging = handlePaging(req);
      videoInfo
        .find(type ? { type: type } : null, video_filter)
        .sort({ update_time: "desc" }) //按更新时间降序
        .skip(paging.start)
        .limit(paging.pageSize)
        .exec((err, data) => {
          if (err) {
            res.json({
              code: constant.RESULT_CODE.FAILD,
              msg: "db faild"
            });
          } else {
            res.json({
              code: constant.RESULT_CODE.SUCCESS,
              msg: "success",
              result: data
            });
          }
        });
    } catch (error) {
      handleError(error, res);
    }
  }

  //根据视频Id查找视频
  getVideoById(req, res, next) {
    try {
      let id = req.params.id;
      videoInfo.findOne({ video_id: id }, (err, data) => {
        if (err) {
          res.json({
            code: constant.RESULT_CODE.FAILD,
            msg: "db faild"
          });
        } else {
          res.json({
            code: constant.RESULT_CODE.SUCCESS,
            msg: "success",
            result: data
          });
        }
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

//处理分页
function handlePaging(req) {
  let page = parseInt(req.query.page);
  let tmpSize = parseInt(req.query.page_size);
  let pageSize = tmpSize ? tmpSize : 50;
  let start = 0;
  if (page) {
    start = (page - 1) * pageSize;
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
    code: constant.RESULT_CODE.FAILD,
    msg: "服务器内部错误"
  });
}

//处理数据
function handleData(error,res){
    
}

module.exports = new VideoController();
