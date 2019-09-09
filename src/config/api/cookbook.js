import util from "../../util/JsonUtil";
import {commom, getAuth, post, realFetch} from "../../util/fetch";
import {Toast} from "antd-mobile";

/**
 *查询订单
 */
const getCookBook = function (id) {
    let obj = util.deepClone(commom);
    obj.id = id;
    obj = getAuth(obj);
    const _url = `cookbook/info`;
    return post(_url, obj).then(res => {
        if (res.status === 200) {
            return res.data.data.content.reply.dish[0];
        } else {
            return null;
        }
    });
};

export {getCookBook};