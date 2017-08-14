const video_home = require("../model/video_home");
const video_line = require("../model/video_line");
async function saveVideoHome(videoHome) {
  video_home.findOne(
    {
      movie_id: videoHome.movie_id
    },
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        if (!res) {
          video_home.create(videoHome, (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log(videoHome.movie_id + "插入成功");
            }
          });
        } else {
          if (res.tag != videoHome.tag) {
            video_home.update(
              { _id: res._id },
              {
                tag: videoHome.tag,
                update_line_tag: true
              },
              (err, res) => {
                console.log(videoHome.movie_id, "更新成功");
              }
            );
          }
        }
      }
    }
  );
}

function findVideoByPage(typeId, page) {
  return new Promise((resolve, reject) => {
    var pagesize = 20;
    page = parseInt(page);
    if (page == NaN || page < 1) {
      page = 1;
    }
    typeId = parseInt(typeId);
    var start = (page - 1) * pagesize;
    video_home
      .find({ type: typeId })
      .skip(start)
      .limit(pagesize)
      .exec((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
}

function saveVideoLineByVideoId(vieoLine) {
  video_home.findOne({ movie_id: vieoLine.videoId }, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      
    }
  });
  video_line.findOne(
    { lineName: vieoLine.lineName, videoId: videoId },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        if (!res) {
        }
      }
    }
  );
}

exports.saveVideoHome = saveVideoHome;
exports.findVideoByPage = findVideoByPage;
