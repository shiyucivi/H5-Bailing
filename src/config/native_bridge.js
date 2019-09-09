//通用

/**
 *获取输入元素
 *
 */
function FOCUS_TARGET_TO_NATIVE() {
  window.AppBridge.focusTargetToNative();
}
/**
 *
 *销毁输入元素
 */
function LOST_TARGET_TO_NATIVE() {
  window.AppBridge.lostTargetToNative();
}

//设置H5焦点元素input值
window._FOCUS_TARGET_SET_VALUE = function(value) {
  //   target.value = value;
};

/**
 *返回native poi电
 *
 */
function LAUNCH_TARGET_POI(poi) {
  window.AppBridge.selectAddress(JSON.stringify(poi));
}
/**
 *跳转页面
 *乘机人信息
 “修改乘机人”“添加乘机人”
 * @param {*} linkNAme
 */
window._LINK_TO = function(linkNAme) {
  let routeName = "";
  switch (linkNAme) {
    case "passnerger":
      routeName = "/user/userList";
      break;
  }
  this.props.history.push(routeName);
};
/**
 *提交订单
 *下一步、下单、锁座、付款吧”，“支付”
 *
 */
window._NEXT = function() {};
/**
 *返回”
 *
 */
window._GOBACK = function() {};

// 支持语音指令：

// （1）用户信息的填写

//         - 光标在当前位置，用户输出文本，自动填上。

//         - 无论光标在哪个位置，用户指令“添加乘机人”“联系人姓名1”，自动填写用户相应信息栏的内容字段。

// （2）所有支持的语音输出部分

//         - 用户信息：如果用户query“乘机人信息”，根据当前判断需要添加或更改打开用户信息中心页面。

//            如果当前已经显示几个用户信息，用户再次query“取消姓名1姓名2”用户信息刷新，保留当前的乘机人姓名

//         - 联系人信息：“联系方式13789877898” “13789988998”“联系人姓名113898789878”

//         - 用户信息+联系人信息：用户query“联系人信息和用户信息一样”“联系人信息和第一个用户信息一样”

//         - 提交订单：“付款吧”，“支付”，“提交订单”、“修改乘机人”“添加乘机人”“我要手机快速下单”

//         - 操作指令：“返回”“下一步”
/**
 *取消姓名1姓名2
  乘机人信息设置
 *
 */
function _EDIT_PASSNERGER_LIST() {}

/**
 *联系人信息：“联系方式13789877898” “13789988998”“联系人姓名113898789878”
 *
 * @param {*} name
 * @param {*} phone
 */
function _EDIT_CONTACT(name, phone) {}

// 支持语音指令：

// （1）用户信息的填写

//         - 光标在当前位置，用户输出文本，自动填上。

//         - 无论光标在哪个位置，用户指令“我要三间”“入住人王新王梦”，自动填写用户相应信息栏的内容字段。

// （2）所有支持的语音输出部分

//         - 房间数量：“我要三间房”

//         - 入住时间：“下午6点入住”“入住时间选择第二个”

//         - 入住人信息：“入住人XX”、“入住人XX和XX”、“入住人姓名1姓名2”

//         - 联系方式：“联系方式13789877898” “13789988998”

//         - 入住人+联系方式：“入住人XX电话13567899876”，“姓名1入住13678988788”

//         - 提交订单：“付款吧”，“支付”，“提交订单”

//         - 操作指令：“返回”“下一步”

/**
 *我要三间房
 *
 * @param {*} num
 *
 */
function _EDIT_ROOM_NUM(num) {}
/**
 *入住人列表
 *
 * @param {*} list
 *
 */
function _EDIT_CHECK_IN_LIST(list) {}

/**
 *推荐座位 1~4
 *
 * @param {*} num
 */
function _RECOMMEND_SEAT(num) {}
/**
 *座位数量修改
 *
 * @param {*} num
 */
function _EDIT_SEL_SEAT(num) {}

/**
 *修改手机号码
 *
 * @param {*} phone
 */
function _EDIT_PHONE(phone) {}

export { LAUNCH_TARGET_POI };
