// import { StorageUtil } from "./index";
import util from "./JsonUtil";
import http from "./httpRequest";
import { Toast } from "antd-mobile";

/**
 * nli 服务的接口
 */

const NLI_API = "https://apitest.xiaomor.com/api/";
// const NLI_API = "http://101.201.148.192:8000/api/";

const Restfulv2 = "https://apitest.xiaomor.com/api/sales/v2/";

//基础用户信息
let key = "3099B87833837758";
// let key = "8611BDBE67BD3C1A";
let deviceid = "4c5d314c94ac83bef7c71ef0fefd934b";
let latitude = "";
let longitude = "";
let type = "";
let timestamp = "";
let queryid = "";
// let moraccountid = "332124394527636000";
let moraccountid = "385734464749174784";

// let moraccountid = "609372664712134656";

let sign = "";
let userMobile = "";

const token = "yCYIu0mrT1QEPjajnw60U4a652gsCLdH";
const MOR_SECRET = "24b9133ffda7085bcc19bd40309ac18e4eadfa39";
// const MOR_SECRET = "a58065a08532b75543a31616b26ccdbf353abbbd";

var HEADERS_FORM = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: ""
};

var HEADERS_JSON = {
  "Content-Type": "content-type: application/json"
};
// 基础信息参数
var BASE_USER_INFO;
//设备类别 分发不同页面 /支付方式
var DEVICE_SYSTEM_CATEGORY;

/**
 *设置基础用户信息
 *
 * @param {*} jsn
 */
function isAndroidOrios() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
  var isiOS = u.indexOf("iPhone") > -1 || /iPad/gi.test(u); //ios终端
  return [isAndroid, isiOS];
}

/**
 * 安卓下获取基础信息
 * 维护多设备的情况 音响 手机
 *
 * @param {*} jsn
 */

if (isAndroidOrios()[0] && window.AppBridge) {
  // 设置基础信息
  BASE_USER_INFO = window.AppBridge.getUserInfoData();
  getorSetUserInfo(JSON.parse(BASE_USER_INFO));
  //维护手机 音响类别 支付方式不同
  if (window.AppBridge.getSystemModel) {
    DEVICE_SYSTEM_CATEGORY = window.AppBridge.getSystemModel();
  }
}
// window.DEVICE_SYSTEM_CATEGORY = "audio";

/**
 * ios下获取基础信息
 *
 * @param {*} jsn
 */
//

if (isAndroidOrios()[1]) {
  // 设置基础信息

  getBaseData(null, res => {
    // alert("base_info" + res);
    getorSetUserInfo(BASE_USER_INFO);
  });
}

/**
 *退出webview
 *
 */
function exit() {
  // android
  if (isAndroidOrios()[0] && window.AppBridge) {
    window.AppBridge.exit();
  }
  //ios
  if (isAndroidOrios()[1]) {
    // 设置基础信息
    exitView(null, res => {});
  }
}

//获取基础信息方法注册
function getorSetUserInfo(json) {
  if (json) {
    util.setLocalStorage("userBaseInfo", json);
    key = json.key;
    // 之后改变
    moraccountid = json.moraccountid;
    deviceid = json.deviceid;
    latitude = json.latitude;
    longitude = json.longitude;
    type = json.type;
    // timestamp = json.timestamp;
    // queryid = json.queryid;
    // sign = json.sign;
    userMobile = json.userMobile;
  }
}

/**
 * @param {*} paramas
 * 请求ios端数据
 * 基础信息
 * 酒店、机票详情
 * base_info
 * air_detail
 * hotel_detail
 * exit
 * @param {*} callback
 */
function getBaseData(paramas, callback) {
  window.getBaseDataCallback = function(res) {
    callback(res);
  };
  if (window.webkit) {
    window.webkit.messageHandlers.getBaseData.postMessage(paramas);
  }
}

function getHotelData(paramas, callback) {
  window.getHotelDataCallback = function(res) {
    callback(res);
  };
  if (window.webkit) {
    window.webkit.messageHandlers.getHotelData.postMessage(paramas);
  }
}

function getAirData(paramas, callback) {
  window.getAirDataCallback = function(res) {
    callback(res);
  };
  if (window.webkit) {
    window.webkit.messageHandlers.getAirData.postMessage(paramas);
  }
}

function exitView(paramas, callback) {
  window.exitViewCallback = function(res) {
    callback(res);
  };
  if (window.webkit) {
    window.webkit.messageHandlers.exitView.postMessage(paramas);
  }
}

/**
 * *公共参数
 */
var commom = {
  accountid: "",
  // actionname: "",
  deviceid: deviceid,
  key: key,
  // actionname: "",
  latitude: "40.008496",
  longitude: "116.351879",
  // query: "",
  // service: "",
  moraccountid: moraccountid,
  // type: "",
  // userid: "",
  id: "",
  ver: "5.0"
};
/**
 * 闭环服务的请求参数（包含公共参数和业务参数）：
 * http://47.94.58.108:4000/sale/apiv1.0/public-params.html
 */
var requestParams = {
  key: key,
  service: "Sale.handler",
  deviceid: deviceid,
  longitude: 0.0,
  latitude: 0.0,
  // type: "system",
  queryid: "",
  timestamp: "",
  actionname: "",
  moraccountid: moraccountid,
  // ver: "1.0",
  json: "{}"
};

/**
 *axios请求
 *
 * @param {*} url
 * @param {*} [data=null]
 * @param {string} [method="get"]
 * @param {*} [headers=HEADERS_FORM]
 * @param {*} [baseurl=NLI_API]
 * @returns
 */
function realFetch(
  url,
  data = null,
  method = "get",
  headers = HEADERS_FORM,
  baseurl = NLI_API
) {
  console.log(
    "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );
  console.log("┃ url: ", baseurl + url);
  console.log("┃ method: ", method);
  console.log("┃ headers: ", JSON.stringify(headers));
  console.log("┃ data: ", data);
  console.log(
    "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );

  return new Promise((resolve, reject) => {
    Toast.loading("加载中...", 5);

    http({
      url: baseurl + url,
      data: data,
      headers: headers,
      method: method
    })
      .then(responseJson => {
        Toast.hide();
        // alert(JSON.stringify(responseJson));
        console.log("====================================");
        console.log("responseJson", responseJson);
        console.log("====================================");
        //获取转化后的数据responseJson、responseText、responseHtml
        /*return responseJson.movies; */
        resolve(responseJson);
      })
      .catch(error => {
        Toast.hide();
        reject(error);
      });
  });
}

function post(
  url,
  data = null,
  config = { type: "form " },
  headers = HEADERS_FORM
) {
  return realFetch(
    url,
    http.adornData(data, false, config.type),
    "post",
    headers
  );
}

/**
 *签名
 */
let getAuth = function(obj) {
  obj.queryid = util.getQueryId();
  obj.timestamp = util.getTimestamp();
  obj.sign = util.calSign(obj, MOR_SECRET);
  return obj;
};

export {
  NLI_API,
  isAndroidOrios,
  HEADERS_JSON,
  realFetch,
  commom,
  getAuth,
  post,
  getorSetUserInfo,
  getHotelData,
  getAirData,
  exit,
  DEVICE_SYSTEM_CATEGORY
};
