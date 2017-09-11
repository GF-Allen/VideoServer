const TYPE_ALL = {
    1: "电影",
    2: "电视剧",
    3: "综艺",
    4: "动漫",
    5: "港剧",
    6: "剧情片",
    7: "日剧",
    8: "动作片",
    9: "嫩妹写真",
    10: "欧美剧",
    11: "泰剧",
    12: "伦理片",
    13: "爱情片",
    14: "台剧",
    15: "科幻片",
    17: "美女视频秀",
    18: "战争片",
    19: "恐怖片",
    20: "喜剧片",
    21: "韩剧",
    22: "国产剧"
  };

const TYPE_MENU = {
    1:[TYPE_ALL[8],TYPE_ALL[13],TYPE_ALL[18],TYPE_ALL[20],TYPE_ALL[15],TYPE_ALL[6],TYPE_ALL[19],TYPE_ALL[12]],//电影
    2:[TYPE_ALL[22],TYPE_ALL[5],TYPE_ALL[7],TYPE_ALL[10],TYPE_ALL[21],TYPE_ALL[14],TYPE_ALL[11]],//电视剧
    3:[TYPE_ALL[3]],
    4:[TYPE_ALL[4]]
};

const RESULT_CODE = {
  SUCCESS: 10000,
  FAILD: 10010,
  AUTH_FAILD: 10011
};

exports.TYPE_MENU = TYPE_MENU;
exports.TYPE_ALL = TYPE_ALL;
exports.RESULT_CODE = RESULT_CODE;
