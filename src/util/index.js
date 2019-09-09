import { Component } from "react";
// import AsyncStorage from "@react-native-community/async-storage";
import JsonUtil from "./JsonUtil";
export const orderType = ["ALL_ORDER", "NO_PAY", "WAIT", "DONE"];

export class StorageUtil extends Component {
  /*
   * 保存
   * */
  static save(key, value, callback) {
    return localStorage.setItem(key, JsonUtil.jsonToStr(value), callback);
  }
  /*
   * 获取
   * */
  static get(key) {
    return localStorage.getItem(key).then(value => {
      const jsonValue = JsonUtil.strToJson(value);
      return jsonValue;
    });
  }
  /*
   * 更新
   * */
  static update(key, value, callback) {
    StorageUtil.get(key).then(item => {
      value =
        typeof value === "string" ? value : Object.assign({}, item, value);
      return localStorage.setItem(key, JsonUtil.jsonToStr(value), callback);
    });
  }
  /*
   * 删除
   * */
  static delete(key, callback) {
    localStorage.removeItem(key, callback);
  }
}
