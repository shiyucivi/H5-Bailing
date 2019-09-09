import util from "../../util/JsonUtil";
import { commom, getAuth, post, realFetch } from "../../util/fetch";
import { Toast } from "antd-mobile";

/**
 *查询订单
 */
const getOrderList = function(jsonData) {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(jsonData);
  obj = getAuth(obj);
  const _url = `trade/order/orderList`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      if (
        res.data.data.json.data.items &&
        res.data.data.json.data.items.length > 0
      ) {
        return res.data.data.json.data.items;
      } else {
        return [];
      }
    } else {
      return [];
    }
  });
};
/**
 *获取订单详情
 */
const getOrderDetail = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  const _url = `trade/order/orderDetail`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      if (res.data.data) {
        if (res.data.data.json.data) {
          return res.data.data.json.data;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
};
/**
 *预下单
 */
const preOrder = (json, type) => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url;
  if (type == "air") {
    _url = `trade/flight/flightPreOrder`;
  } else {
  }

  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
/**
 *通用下单
 */
const order = (json, type) => {
  let obj = util.deepClone(commom);
  let _url;
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  switch (type) {
    case "air":
      _url = `trade/flight/order`;

      break;
    case "hotel":
      _url = `trade/hotel/order`;

      break;
    case "movie":
      _url = `trade/movie/order`;

      break;
    default:
      _url = `trade/flight/order`;
      break;
  }
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};

/**
 *取消订单
 */
const cancelOrder = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/order/cancel`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
/**
 * movie seatMap
 *
 */
const getSeatMap = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/movie/seatMap`;
  return post(_url, obj).then(res => {
    if (res.status == 200) {
      if (res.data.data.json.status == 0) {
        return res.data.data.json.data;
      } else {
        Toast.info(res.data.data.json.message, 3);

        return res.data.data.json.data;
      }
    }
  });
};
/**
 * 修改通知人手机号接口
 *
 */
const changeInformPhone = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/order/changeInformPhone`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
/**
 * 订单状态获取接口
 *
 */
const orderStatus = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/order/orderStatus`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
/**
 * 检查地址配送范围
 *
 */
const checkDelivery = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/takeout/checkDelivery`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
/**
 * 根据购物车id查询详情
 *
 */
const cartCommodityAttributes = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/takeout/cartCommodityAttributes`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
/**
 * 基于购物车升级
 *
 */
const cart = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/takeout/cart`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
/**
 * 基于购物车提交订单
 *
 */
const orderByCart = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/takeout/orderByCart`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
/**
 * 获取用户信息填写默认值接口
 */
const defaultUserInfo = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/order/defaultUserInfo`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      return res.data.data.json;
    } else {
      return null;
    }
  });
};
export {
  getOrderList,
  getOrderDetail,
  preOrder,
  order,
  cancelOrder,
  getSeatMap,
  changeInformPhone,
  orderStatus,
  checkDelivery,
  cartCommodityAttributes,
  cart,
  orderByCart,
  defaultUserInfo
};
