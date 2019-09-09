import React from "react";

import Nav from "../../components/nav/audio_nav.js";
import OrderDetailList from "../../components/orderdetail/OrderDetailList.jsx";
import ConfirmButton from "../../components/button/PayConfirmButton.jsx";
import { exit } from "../../util/fetch";
import API from "../../config/api/";
import { Toast } from "antd-mobile";
import Timeout from "../../components/timeout/index.jsx";
import Util from "../../util/JsonUtil";
export default class HotelOrderTailPage extends React.Component {
  constructor(props) {
    super(props);
    this.pay = this.pay.bind(this);
    this.state = {
      timeoutNum: 15,
      timeoutFlag: false,
      isDetailPage: false,
      order_pay_able: false //是否可以退款 支付
    };
    this.cancelOrder = this.cancelOrder.bind(this);
    this.timeoutCallback = this.timeoutCallback.bind(this);
  }
  //支付超时回调
  timeoutCallback() {
    this.setState({
      timeoutFlag: true
    });
  }
  //支付事件
  pay() {
    if (this.state.timeoutFlag) {
      return;
    }
    this.props.history.push(`/qrPay/${this.props.match.params.id}`);
  }
  componentWillMount() {
    /**
     *下一步、下单、锁座”
     *
     */
    window["_NEXT"] = () => {
      this.pay();
    };
  }
  componentDidMount() {
    //如果带有detail参数责为detai页面
    if (
      this.props.location.search &&
      Util.getQueryString("type", this.props.location.search)
    ) {
      this.setState({
        isDetailPage: true
      });
    }
  }

  // 取消支付
  cancelOrder = () => {
    API.cancelOrder({
      order_code: this.props.match.params.id
    }).then(res => {
      if (res.status === 0 && res.message === "SUCCESS") {
        Toast.info("取消订单成功！", 2);
        setTimeout(() => {
          this.props.history.goBack();
        }, 1000 * 2);
      } else {
        Toast.info(res.message, 2);
      }
    });
  };
  // 处理订单详情
  //方法被调用时可以支付或者取消订单
  handelCallback = e => {
    this.setState({
      order_pay_able: true
    });
  };
  render() {
    const { isDetailPage, order_pay_able } = this.state;
    return (
      <div className="zoom_audio" style={{ padding: "0 50px" }}>
        <Nav
          title={isDetailPage ? "订单详情" : "确认支付"}
          leftButton
          leftButtonClick={() => {
            if (this.state.isOrder) {
              return exit();
            } else {
              return this.props.history.goBack();
            }
          }}
          rightButton={
            !isDetailPage && (
              <Timeout
                time={this.state.timeoutNum}
                callBack={this.timeoutCallback}
              />
            )
          }
        />
        <OrderDetailList
          orderType={"airplane"}
          handelCallback={this.handelCallback}
          isDetailPage={isDetailPage}
          payState={false}
          orderCode={this.props.match.params.id}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5%"
          }}
        >
          <div>
            {order_pay_able && (
              <span onClick={this.pay}>
                <ConfirmButton
                  buttonType={this.state.timeoutFlag ? "" : "confirm"}
                  content={
                    this.state.timeoutFlag ? "支付超时，订单已取消" : "确认支付"
                  }
                />
              </span>
            )}
          </div>
          <div>
            {order_pay_able && isDetailPage && (
              <span onClick={this.cancelOrder}>
                <ConfirmButton buttonType="confirm" content="取消订单" />
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}
