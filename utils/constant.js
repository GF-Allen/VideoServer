const TYPE_ALL = [{
        id: 1,
        name: "电影",
        subTypes: [
            { id: 8, name: "动作片" },
            { id: 11, name: "爱情片" },
            { id: 14, name: "战争片" },
            { id: 16, name: "喜剧片" },
            { id: 13, name: "科幻片" },
            { id: 6, name: "剧情片" },
            { id: 15, name: "恐怖片" }
        ]
    },
    {
        id: 2,
        name: "电视剧",
        subTypes: [
            { id: 18, name: "国产剧" },
            { id: 5, name: "港剧" },
            { id: 7, name: "日剧" },
            { id: 9, name: "欧美剧" },
            { id: 17, name: "韩剧" },
            { id: 12, name: "台剧" },
            { id: 10, name: "泰剧" }
        ]
    },
    { id: 3, name: "综艺" },
    { id: 4, name: "动漫" },
    { id: 5, name: "港剧" },
    { id: 6, name: "剧情片" },
    { id: 7, name: "日剧" },
    { id: 8, name: "动作片" },
    { id: 9, name: "欧美剧" },
    { id: 10, name: "泰剧" },
    { id: 11, name: "爱情片" },
    { id: 12, name: "台剧" },
    { id: 13, name: "科幻片" },
    { id: 14, name: "战争片" },
    { id: 15, name: "恐怖片" },
    { id: 16, name: "喜剧片" },
    { id: 17, name: "韩剧" },
    { id: 18, name: "国产剧" },
    { id: 19, name: "嫩妹写真" },
    { id: 20, name: "美女视频秀" },
    { id: 21, name: "伦理片" },
];

// const TYPE_MENU = {
//   1: [
//     TYPE_MENU[8],
//     TYPE_MENU[13],
//     TYPE_MENU[18],
//     TYPE_MENU[20],
//     TYPE_MENU[15],
//     TYPE_MENU[6],
//     TYPE_MENU[19]
//   ], //电影
//   2: [
//     TYPE_MENU[22],
//     TYPE_MENU[5],
//     TYPE_MENU[7],
//     TYPE_MENU[10],
//     TYPE_MENU[21],
//     TYPE_MENU[14],
//     TYPE_MENU[11]
//   ], //电视剧
//   3: "综艺",
//   4: "动漫",
//   5: "港剧",
//   6: "剧情片",
//   7: "日剧",
//   8: "动作片",
//   // 9: "嫩妹写真",
//   10: "欧美剧",
//   11: "泰剧",
//   // 12: "伦理片",
//   13: "爱情片",
//   14: "台剧",
//   15: "科幻片",
//   // 17: "美女视频秀",
//   18: "战争片",
//   19: "恐怖片",
//   20: "喜剧片",
//   21: "韩剧",
//   22: "国产剧"
// };

const RESULT_CODE = {
    SUCCESS: {code:200,msg:'请求成功'},
    CREATE_SUCCESS:{code:201,msg:'创建成功'},
    UPDATE_SUCCESS:{code:202,msg:'修改成功'},
    DELETE_SUCCESS:{code:204,msg:'删除成功'},
    ARG_ERROR:{code:400,msg:'参数错误'},
    NO_LOGIN:{code:401,msg:'未登录'},
    FORBIDDEN:{code:403,msg:'禁止访问'},
    NOT_FOUND:{code:404,msg:'未找到'},
    INTERNAL_ERROR:{code:500,msg:'服务器内部错误'},
    FAILD:{code:503,msg:'请求失败'}
};

// exports.TYPE_MENU = JSON.parse(TYPE_MENU);
exports.TYPE_ALL = TYPE_ALL;
exports.RESULT_CODE = RESULT_CODE;