//签名加密

import CryptoJS from "crypto-js";
import Base64 from "crypto-js/enc-base64";
import { TreeMap } from "jstreemap";

// 序列化反序列化法
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// obj是json对象，key对应的value须为字符串，空值用空串表示即可
const calSign = function(obj, keySecret) {
  let res = "";
  let map = new TreeMap();
  for (let i in obj) {
    var key = encodeURIComponent(i);
    var encode = encodeURIComponent(obj[i]);
    if (key != "sign") {
      map.set(key, encode);
    }
  }
  for (let [k, v] of map) {
    res += k + "=" + v + "&";
  }
  res = res.substring(0, res.length - 1);
  var result = Base64.stringify(CryptoJS.HmacSHA1(res, keySecret));
  return result.replace(/\+/g, "-").replace(/\//g, "_");
};
/**
 * 生成接口请求的queryid参数
 */
function getQueryId() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
/**
 * 获取当前的时间戳
 */
const getTimestamp = function() {
  return new Date().getTime() * 1000;
};
const jsonToStr = function(json) {
  return JSON.stringify(json);
};
const strToJson = function(string) {
  return JSON.parse(string);
};
// 根据身份证获取信息
const IdCard = function(UUserCard, num) {
  if (num == 1) {
    //获取出生日期
    var birth =
      UUserCard.substring(6, 10) +
      "-" +
      UUserCard.substring(10, 12) +
      "-" +
      UUserCard.substring(12, 14);
    return birth;
  }
  if (num == 2) {
    //获取性别
    if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
      //男
      return "男";
    } else {
      //女
      return "女";
    }
  }
  if (num == 3) {
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
    if (
      UUserCard.substring(10, 12) < month ||
      (UUserCard.substring(10, 12) == month &&
        UUserCard.substring(12, 14) <= day)
    ) {
      age++;
    }
    return age;
  }
};
/**
 * 把json 对象转成 url get 形式的字符串
 * @param {} jsonObj
 */
export function convertJsonToUrlParams(jsonObj) {
  var result = "";
  for (var key in jsonObj) {
    var kv = key + "=" + jsonObj[key] + "&";
    result += kv;
  }

  var length = result.length;
  return result.substring(0, length - 1);
}
//阻止内存泄露
function inject_unount(target) {
  // 改装componentWillUnmount，销毁的时候记录一下
  let next = target.prototype.componentWillUnmount;
  target.prototype.componentWillUnmount = function() {
    if (next) next.call(this, ...arguments);
    this.unmount = true;
  };
  // 对setState的改装，setState查看目前是否已经销毁
  let setState = target.prototype.setState;
  target.prototype.setState = function() {
    if (this.unmount) return;
    setState.call(this, ...arguments);
  };
}
/**
 *
 *set localstorage
 * @export
 * @param {*} key
 * @param {*} value
 */
function setLocalStorage(key, value) {
  var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
  var valueDate = JSON.stringify({
    val: value,
    timer: curtime
  });
  function isQuotaExceeded(e) {
    var quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014: // Firefox
            if (e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
              quotaExceeded = true;
            }
            break;
          default:
            console.log(e.code);
        }
      } else if (e.number === -2147024882) {
        // IE8
        quotaExceeded = true;
      }
    }
    return quotaExceeded;
  }
  try {
    localStorage.setItem(key, valueDate);
  } catch (e) {
    /*if(e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.log("Error: 本地存储超过限制");
            localStorage.clear();
        } else {
            console.log("Error: 保存到本地存储失败");
        }*/
    // 兼容性写法
    if (isQuotaExceeded(e)) {
      console.log("Error: 本地存储超过限制");
      localStorage.clear();
    } else {
      console.log("Error: 保存到本地存储失败");
    }
  }
}

/**
 *
 *getLocalStorage
 * @export
 * @param {*} key
 * @returns
 */
function getLocalStorage(key) {
  var exp = 60 * 60 * 24; // 一天的秒数
  if (localStorage.getItem(key)) {
    var vals = localStorage.getItem(key); // 获取本地存储的值
    var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
    // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
    var isTimed = new Date().getTime() - dataObj.timer > exp;
    if (isTimed) {
      console.log("存储已过期");
      localStorage.removeItem(key);
      return null;
    } else {
      var newValue = dataObj.val;
    }
    return newValue;
  } else {
    return null;
  }
}

const getQueryString = (name, url) => {
  const pattern = new RegExp(`[\\?&#]${name}=([^&#]+)`, "gi");
  const ma = url.match(pattern);
  let strArr;

  if (ma && ma.length > 0) {
    strArr = ma[ma.length - 1].split("=");
    if (strArr && strArr.length > 1) {
      return strArr[1];
    }
    return "";
  }
  return "";
};
export default {
  jsonToStr,
  strToJson,
  calSign,
  getQueryId,
  getTimestamp,
  convertJsonToUrlParams,
  IdCard,
  inject_unount,
  deepClone,
  setLocalStorage,
  getLocalStorage,
  getQueryString
};
