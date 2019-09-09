import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// redux&&ract-redux
import { Provider } from "react-redux";
import store from "./reducer";
// antd
import "antd-mobile/dist/antd-mobile.css";
// axios
import _axios from "./util/httpRequest";

import "./config/time.js";

console.log("initial state: ", store.getState());
//
// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== "production") {
  require("./mock");
}
React.Component.prototype.http = _axios;
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
