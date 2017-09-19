const http = require("request");
const S = require("string");
const constant = require("../../utils/constant");
/**
 * 名人控制器
 */
const douban_url = "https://movie.douban.com/j/subject_suggest?q=";
class CelebrityController{
    constructor(){};

    /**
     * 获取名人的封面
     */
    getCelebrityPic(req, res, next){
        let name = req.params.name;
        let url = douban_url + name;
        url = encodeURI(url);//url转码
        http(url,(error, response, body)=>{
            if(error){
                res.json({
                    code: constant.RESULT_CODE.NOT_FOUND.code,
                    msg: "获取信息失败",
                });
                return;
            }
            body = JSON.parse(body);
            let celebrity = {};
            for (let i = 0; i < body.length; i++) {
                let el = body[i];
                if(el.type == "celebrity"){
                    celebrity = el;
                    break;
                }
            }

            if(celebrity.img){
                celebrity.img = S(celebrity.img).replaceAll("small","large").s;
            }

            delete celebrity.url;
            delete celebrity.type;
            delete celebrity.id;

            res.json({
                code: constant.RESULT_CODE.SUCCESS.code,
                msg: constant.RESULT_CODE.SUCCESS.msg,
                result: celebrity
            });
        })
    }
}

module.exports = new CelebrityController();