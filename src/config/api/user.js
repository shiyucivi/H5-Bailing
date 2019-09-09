import util from "../../util/JsonUtil";
import { commom, getAuth, post, HEADERS_JSON } from "../../util/fetch";
import { Toast } from "antd-mobile";

/**
 *获取乘机人列表
 */
const getUserList = () => {
  let obj = util.deepClone(commom);
  obj = getAuth(obj);
  const convertUrl = util.convertJsonToUrlParams(obj);
  const _url = `user/passenger/getPassengerInfoList?${convertUrl}`;
  return post(_url, { data: {} }, { type: "json" }, HEADERS_JSON).then(res => {
    if (res.status === 200) {
      return res.data.data;
    } else {
      return null;
    }
  });
};
/**
 *新增修改乘机人
 */
const addOrEditUser = (json, edit = false) => {
  let obj = util.deepClone(commom);
  obj = getAuth(obj);
  const convertUrl = util.convertJsonToUrlParams(obj);
  let _url = "";
  if (edit) {
    _url = `user/passenger/modifyPassengerInfo?${convertUrl}`;
  } else {
    _url = `user/passenger/addPassengerInfo?${convertUrl}`;
  }
  return post(_url, json, { type: "json" }, HEADERS_JSON).then(res => {
    if (res.status === 200) {
      return res.data.data;
    } else {
      return null;
    }
  });
};

/**
 *获取地址列表
 */
const getAddressList = () => {
    let obj = util.deepClone(commom);
    obj = getAuth(obj);
    const convertUrl = util.convertJsonToUrlParams(obj);
    const _url = `user/address/selectAddressListByUid?${convertUrl}`;
    return post(_url, { data: {} }, { type: "json" }, HEADERS_JSON).then(res => {
        if (res.status === 200) {
            return res.data.data;
        } else {
            return null;
        }
    });
};

/**
 * 添加地址
 * */
const addOrEditAddress = (json, edit = false) => {
  let obj = util.deepClone(commom);
  obj = getAuth(obj);
  const convertUrl = util.convertJsonToUrlParams(obj);
  let _url = "";
  if (edit) {
    _url = `user/address/addDeliveryAddress?${convertUrl}`;
  } else {
    _url = `user/address/modifyDeliveryAddress?${convertUrl}`;
  }
  return post(_url, json, { type: "json" }, HEADERS_JSON).then(res => {
    if (res.status === 200) {
      return res.data.data;
    } else {
      return null;
    }
  });
};

/**
 * 修改电影票订单联系人手机号
 */
const editMovieUser=(json)=>{
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/order/changeInformPhone`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data;
    } else {
      return null;
    }
  });
}

export { getUserList, addOrEditUser,addOrEditAddress,getAddressList,editMovieUser};
