const video_home = require("../../model/video_home");
async function save_video_home(videoHome) {
  console.log(videoHome);
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
        }
      }
    }
  );
}

module.exports = save_video_home;
