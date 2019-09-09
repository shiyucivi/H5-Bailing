### 安装 node 平台

[node](https://www.baidu.com/link?url=cQPMXeccgxnJzoyF8nVoaqZ4aqIh6lP3VlBzOKFo3EHIobRVmAmS1LPee-vFBdiS&wd=&eqid=b0b72e8e0002f4df000000065d0b818d)

### 安装依赖 `npm instal`

    (有时需要管理员权限)

### 运行命令 `npm start`

### H5-订单中心

#### 工程目录简介

- yarn.lock 项目文件依赖安装包的版本号
- config webpack 打包及其配置

- package.json
  任何一个脚手架工具里面都有一个 package.json 文件，代表脚手架工具其实是一个 node 包工具，有一些项目介绍，依赖的包等
- node_modules 文件夹
  放的是我们所建项目放所依赖的第三方的包
- public 文件夹
  favicon.ico
  图标文件
  index.html
  项目首页的模板
- Src 文件夹
  里面放了我们项目所有的源代码
  +app.js
  整个程序的入口文件
```
.
├── README.md
├── config
│   ├── env.js
│   ├── jest
│   │   ├── cssTransform.js
│   │   └── fileTransform.js
│   ├── modules.js
│   ├── paths.js
│   ├── webpack.config.js
│   └── webpackDevServer.config.js
├── config-overrides.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── scripts
│   ├── build.js
│   ├── start.js
│   └── test.js
├── src
│   ├── App.css 其中 React-route 包含前端路由
│   ├── App.js
│   ├── App.test.js
│   ├── components  
│   │   ├── card
│   │   ├── list
│   │   └── nav
│   ├── index.css  
│   ├── index.js  
│   ├── logo.svg
│   ├── reducer
│   │   ├── action-type.js
│   │   ├── action.js
│   │   └── index.js
│   ├── serviceWorker.js
│   ├── util
│   │   ├── JsonUtil.js 鉴权相关
│   │   ├── fetch.js 接口请求
│   │   ├── httpRequest.js
│   │   ├── index.js
│   │   └── util.js
│   └── view 页面主入口
│   ├── air 机票订单
│   ├── hotel 酒店订单
│   ├── order 订单列表
│   ├── test.jsx
│   └── user 用户列表
├── tree.md
├── tree.txt
├── yarn-error.log
└── yarn.lock

```
#### 页面模板

```javascript
import React from "react";
import React from "react";
// import { connect } from "react-redux";
import Nav from "../../../components/nav";
import "./index.css";

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };
  }

  render() {
    return <div>// html</div>;
  }
}
export default Demo;
```

## 演示模版

    /src/components/card/index.jsx

## 样式文件

    /src/components/card/index.css

## 完整页面

    /src/components/list/index.jsx

## 0.1. Learn More

es6:[es6](https://www.jianshu.com/p/f82932d85f35)
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### 0.1.1. Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### 0.1.2. Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### 0.1.3. Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### 0.1.4. Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### 0.1.5. Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### 0.1.6. `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
