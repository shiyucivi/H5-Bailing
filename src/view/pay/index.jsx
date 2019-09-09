import React from "react";
import { connect } from "react-redux";
import Button from "../../components/button";
import StatusImage from "../../components/status";
import "./index.css";
import Nav from "../../components/nav";
import util from "../../util/JsonUtil.js";
export default class PayResult extends React.Component {
  state = {};
  componentDidMount() {}

  render() {
    const result = decodeURIComponent(this.props.location.search);
    let type;
    if (result) {
      let json = util.getQueryString("json", result);
      json = JSON.parse(json);
      const proStatusList = json.proStatusList;
      type = proStatusList[0].proStatus;
    }
    let text, url;

    switch (Number(type)) {
      case 102:
        text = "支付成功";
        url = require("../../assets/icon/ic_orders_pay_success.png");
        break;
      case 103:
        text = "订单已取消";
        url = require("../../assets/icon/ic_orders_cancel.png");
        break;
      default:
        text = "支付失败";
        url = require("../../assets/icon/ic_orders_pay_fail.png");
    }
    return (
      <div>
        <Nav
          title="订单详情"
          leftButton
          leftButtonClick={this.props.history.goBack}
        />
        <StatusImage image={<img src={url} width="100px" />} text={text} />
        <div onClick={() => this.props.history.replace("/")}>
          <Button text="去订单中心" />
        </div>
      </div>
    );
  }
}
