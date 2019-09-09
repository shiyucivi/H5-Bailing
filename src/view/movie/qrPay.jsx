import React from "react";
import * as QrCode from "qrcode.react";
import { Tabs, Toast, Modal } from "antd-mobile";
import Background from "../../assets/img/bg_carbook@2x.png";
import Nav from "../../components/nav/audio_nav";
import "./index.scss";
import API from "../../config/api";
import Timeout from "../../components/timeout";
import { exit } from "../../util/fetch";
import { clearInterval } from "timers";

const sectionStyle = {
  width: "100%",
  height: "100%",
  backgroundImage: `url(${Background})`
};

const tabStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "150px",
  marginBottom: "10px"
};

const tabs = [
  {
    title: "微信支付",
    sub: 0,
    icon_no_active: require("../../assets/img/ic_movie_pay_wechat_nochose@2x.png"),
    icon_active: require("../../assets/img/ic_movie_pay_wechat_normal@2x.png")
  },
  {
    title: "支付宝",
    sub: 1,
    icon_no_active: require("../../assets/img/ic_movie_pay_nochose@2x.png"),
    icon_active: require("../../assets/img/ic_movie_pay_normal@2x.png")
  }
];

const tabBarTextStyle = {
  fontSize: "24px",
  color: "rgba(255,255,255,0.70)"
};

const tabBarUnderlineStyle = {
  width: "150px",
  height: "2px",
  borderColor: "#00C800FF",
  borderRadius: "1px"
};

const tabPageStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255,255,255,1)",
  borderRadius: "4px",
  marginTop: "7px",
  width: "300px",
  height: "300px"
};

const tabDescTextStyle = {
  width: "100%",
  fontSize: "23px",
  fontFamily: "PingFangSC-Regular",
  fontWeight: "400",
  color: "rgba(255,255,255,1)",
  lineHeight: "30px",
  opacity: "0.4",
  margin: "auto",
  textAlign: "center"
};

const tabItem = (tab, current_index) => {
  return (
    <div style={tabStyle}>
      <img
        src={current_index === tab.sub ? tab.icon_active : tab.icon_no_active}
        style={{
          width: "40px",
          height: "40px"
        }}
      />
      <span
        style={{
          fontSize: "24px",
          fontFamily: "PingFangSC-Regular",
          fontWeight: "400",
          color: "rgba(255,255,255,1)",
          lineHeight: "66px"
        }}
      >
        {" "}
        {tab.title}
      </span>
    </div>
  );
};

class QrPay extends React.Component {
  fetchPayRes = (orderCode, payChannel) => {
    let obj = {
      order_code: orderCode,
      pay_channel: payChannel
    };

    API.payQrCOde(obj).then(res => {
      if (res !== null && res !== undefined) {
        this.setState({
          aliPayUrl: res.alipayQrCode,
          wxPayUrl: res.wxpayQrCode,
          isShowCode: true,
          timeoutFlag: true,
          timeout: res.expireTime / 60
        });
      }
    });
    this.fetchOrderDetailTimeout(obj.order_code);
  };
  fetchOrderDetailTimeout = orderCode => {
    let i = 0;
    let timeSpeed = 5;
    let now = Date.now();
    let that = this;
    function fetchStatus() {
      i++;
      if (i > 3) {
        timeSpeed = 10;
      }
      that.timeout = setTimeout(fetchStatus, timeSpeed * 1000);
      // 接口轮训获取订单状态
      API.orderStatus({
        order_code: orderCode
      }).then(res => {
        if (res !== null && res !== undefined) {
          let status = res.data.order_status;
          let order_status_name = res.data.order_status_name;

          if (status) {
            // 第十次轮训后10s一次

            if (status == 102 || order_status_name == "支付成功") {
              //支付成功
              //跳转支付成功页面
              that.props.history.push("/order/payresult/102");
              window.clearTimeout(that.timeout);
            } else if (status == 103) {
              //支付失败
              //跳转支付失败页面

              that.props.history.push("/order/payresult/103");
              window.clearTimeout(that.timeout);
            }
          } else {
            window.clearTimeout(that.timeout);
          }
        }
      });
    }
    this.timeout = setTimeout(fetchStatus, timeSpeed * 1000);
  };
  componentWillUnmount = () => {
    window.clearTimeout(this.timeout);
  };
  constructor(props) {
    super(props);

    this.state = {
      aliPayUrl: "",
      timeOutToastInfo: "支付超时，请退出重试",
      wxPayUrl: "",
      timeout: 15,
      isShowCode: false,
      timeoutFlag: false,
      orderCode: "1000",
      initialPage: 0,
      modal1: false
    };
  }
  componentWillMount() {
    // native 交互方法
    /**
     *支付方式切换
     ali /wx
     *  
     */

    window["_PAY_WAY_CHANGE"] = type => {
      this.changePayWay(type);
    };
  }
  componentDidMount() {
    // 获取参数 判断是否为下单页面
    const BaseInfo = this.props.match.params.id;

    if (BaseInfo) {
      // 无订单信息
      this.fetchPayRes(BaseInfo, 9);
    }
  }
  onClose = key => () => {
    this.setState({
      [key]: false
    });
  };
  changePayWay = type => {
    if (type == "ali") {
      this.setState({
        initialPage: 1
      });
    } else {
      this.setState({
        initialPage: 0
      });
    }
  };
  render() {
    let current_index = 0;
    return (
      <div className="movie_wrap ">
        <Nav
          title={"扫码支付"}
          leftButton
          rightButton={
            this.state.timeoutFlag && (
              <div className="flex_row">
                剩余时间
                <Timeout
                  time={this.state.timeout}
                  config={{ color: "#F5AB00", icon: false }}
                  callBack={() => {
                    Toast.info(this.state.timeOutToastInfo, 100);
                    window.clearTimeout(this.timeout);
                  }}
                />
              </div>
            )
          }
          leftButtonClick={() => {
            this.setState({
              modal1: true
            });
          }}
        />
        <div style={{ width: "300px", margin: "20px auto" }}>
          <Tabs
            tabs={tabs}
            initialPage={0}
            page={this.state.initialPage}
            tabBarTextStyle={tabBarTextStyle}
            tabBarUnderlineStyle={tabBarUnderlineStyle}
            tabBarActiveTextColor="#FFFFFF"
            tabBarBackgroundColor="rgba(255,255,255,0)"
            onChange={(tab, index) => {
              current_index = index;
              console.log("onChange", index, tab);
            }}
            onTabClick={(tab, index) => {
              this.setState({
                initialPage: index
              });
              console.log("onTabClick", index, tab);
            }}
            renderTab={tab => tabItem(tab, current_index)}
          >
            <div style={tabPageStyle}>
              <QrCode
                value={this.state.wxPayUrl}
                size={182}
                style={{
                  display: this.state.isShowCode ? "inline" : "none"
                }}
              />
            </div>
            <div style={tabPageStyle}>
              <QrCode
                value={this.state.aliPayUrl}
                size={182}
                style={{
                  display: this.state.isShowCode ? "inline" : "none"
                }}
              />
            </div>
          </Tabs>
        </div>
        <div style={tabDescTextStyle}>
          {this.state.initialPage === 0
            ? "使用手机微信客户端扫码支付"
            : "使用手机支付宝客户端扫码支付"}
        </div>
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={false}
          onClose={this.onClose("modal1")}
          title="提醒"
          footer={[
            {
              text: "继续支付",
              onPress: () => {
                this.onClose("modal1")();
              }
            },
            {
              text: "离开",
              onPress: () => {
                this.onClose("modal1")();
                exit();
              }
            }
          ]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <p style={{ fontSize: "14px" }}>支付尚未完成，确定要离开？</p>
        </Modal>
      </div>
    );
  }
}

export default QrPay;
