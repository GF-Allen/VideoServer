const Movie = require("./video_home");

var movie = {
  title: "小金刚",
  home_path: "http://www.baidu.com",
  movie_id: "11111"
};

Movie.create(movie, err => {
  if (err) {
    console.log(err);
  } else {
    console.log("插入成功");
  }
});

Movie.findOne({ movie_id: "11111" }, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
