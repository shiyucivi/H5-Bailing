import React from "react";
import { connect } from "react-redux";
import {
  InputItem,
  Toast,
  Modal,
  List,
  WingBlank,
  Button,
  WhiteSpace
} from "antd-mobile";
import Nav from "../../components/nav";
import CardAir from "../../components/card/air";
import PayMent from "../../components/pay";
import Timeout from "../../components/timeout";

import "./index.scss";
import { createForm } from "rc-form";
import API from "../../config/api/";
import { renderItem } from "../order";
import { setHotelOrder } from "../../reducer/action";
import { bindActionCreators } from "redux";

class HotelOrderDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOrder: false,
      isPay: false,
      totlePrice: 0,
      payType: "",
      timeoutNum: 15,
      timeoutFalg: false,
      editable: false,
      showTable: false,
      modal1: false
    };
  }
  componentDidMount() {
    // 获取参数 判断是否为下单页面
    const BaseInfo = !this.props.match.params.id;
    if (!BaseInfo) {
      // 无订单信息
      this.fetchOrderDetail();
    }
  }
  /**
   *下单
   *
   * @memberof AirDetailPage
   */
  fetchOrderDetail = (params = { order_code: this.props.match.params.id }) => {
    API.getOrderDetail(params).then(res => {
      if (res.create_time) {
        if (res.product_items[0]) {
          res.detail = res.product_items[0].product_desc.split(";");
        }
        this.props.setHotelOrder(res);
        //房间数
        this.setState({
          isPay: true,
          totlePrice: res.total_price * 100,
          timeoutFalg: true
        });
        // 判断订单是否超时 并显示超时定时器
        // eslint-disable-next-line no-unused-expressions
        var now = new Date();
        var ago = new Date(res.create_time.replace("//-/g", "//"));
        var distance = (
          parseInt(now.getTime() - ago.getTime()) /
          1000 /
          60
        ).toFixed(1);
        if (distance < 15) {
          this.setState({
            timeoutFalg: true,
            timeoutNum: 15 - distance
          });
        }
        if (res.contact_phone) {
          this.props.form.setFieldsValue({
            contact_info_mobile: res.contact_phone
          });
        }
      } else {
        Toast.info("订单无效", 1);
      }
    });
  };
  handelChangePay = payType => {
    this.setState({
      payType: payType
    });
  };
  changeTime = e => {
    this.setState({
      showDialog: !this.state.showDialog
    });
  };
  /**
   *修改到店时间
   *
   * @memberof HotelOrderDetailsPage
   */
  changeArrTime = date => {
    this.setState({
      arrTime: date
    });
    // close dialog
    this.onClose("showDialog")();
  };
  onClose = key => () => {
    this.setState({
      [key]: false
    });
  };
  /**
   *下单&支付
   *
   * @memberof AirDetailPage
   */
  order = () => {
    let obj = {
      order_code: this.props.hotelOrder.order_code,
      pay_channel: this.state.payType == "ali" ? 8 : 7
    };
    this.pay(obj);
  };
  pay = res => {
    API.pay(res);
  };
  render() {
    const { getFieldProps } = this.props.form;
    let order = this.props.hotelOrder;

    return (
      <div>
        <Nav
          title="订单支付"
          leftButton
          leftButtonClick={() => {
            this.setState({
              modal1: true
            });
          }}
        />
        <div className="wrap">
          <CardAir
            noMargin
            title="酒店信息"
            titleR={
              <div>
                {this.state.timeoutFalg && (
                  <Timeout time={this.state.timeoutNum} callBack={() => {}} />
                )}
              </div>
            }
          >
            {/* 酒店信息 */}
            <div>
              <div>
                {order.commodity_category &&
                  renderItem(Object.assign({}, order, { show: true }))}
              </div>
              <p>地址 {order.address}</p>
              {order.merchant_contact && <p>电话 {order.merchant_contact}</p>}
            </div>
          </CardAir>
          <div className={this.state.showTable ? "show" : "hide"}>
            <CardAir noMargin title="入住人信息">
              <List>
                {!this.state.isOrder &&
                  this.props.hotelOrder.checkin_names
                    .split(",")
                    .map((i, index) => (
                      <InputItem
                        key={i}
                        clear
                        {...getFieldProps(`contact_info_name${i}`)}
                        placeholder="请填写入住人的姓名"
                        value={i}
                        editable={this.state.isOrder}
                        // ref={el => (this.autoFocusInst1 = el)}
                        maxLength="11"
                      >
                        入住人{index + 1}
                      </InputItem>
                    ))}
                <InputItem
                  clear
                  {...getFieldProps("contact_info_mobile")}
                  placeholder="手机号码"
                  editable={this.state.isOrder}
                  ref={el => (this.autoFocusInst1 = el)}
                  maxLength="11"
                >
                  联系方式
                </InputItem>
              </List>
            </CardAir>
          </div>
          {/* 预订信息 */}
          {this.state.showTable && (
            <CardAir noMargin title="预订信息">
              <div>
                <p className="edit">
                  <span className="editspan">预订时间</span>
                  <span>
                    {order.checkin_date}-{order.checkout_date} 共{" "}
                    {order.stay_day_num} 天
                  </span>
                </p>
                <p className="edit">
                  <span className="editspan">预订数量</span>
                  <span>共 {order.room_num} 间</span>
                </p>
                <p className="edit">
                  <span className="editspan">订单编号</span>
                  <span>{order.order_code}</span>
                </p>

                <p className="edit">
                  <span className="editspan">下单时间</span>
                  <span>{order.create_time}</span>
                </p>
              </div>
            </CardAir>
          )}

          {this.state.showTable ? (
            <div
              className="tablShow"
              onClick={() => {
                this.setState({
                  showTable: !this.state.showTable
                });
              }}
            >
              <span>收起详情</span>
              <img
                className="icon"
                src={require("../../assets/icon/ic_pay_detail_close@2x.png")}
              />
            </div>
          ) : (
            <div
              className="tablShow"
              onClick={() => {
                this.setState({
                  showTable: !this.state.showTable
                });
              }}
            >
              <span>展开详情</span>
              <img
                className="icon"
                src={require("../../assets/icon/ic_pay_detail_open@2x.png")}
              />
            </div>
          )}
          <CardAir title="支付方式">
            <PayMent changeType={this.handelChangePay} defaultPAy="ali" />
          </CardAir>
          <WingBlank size="lg">
            <p
              style={{
                color: "#8B8B96",
                fontSize: "12px",
                paddingLeft: "10px"
              }}
            >
              订单只保留15分钟，请尽快完成支付
            </p>
          </WingBlank>

          <WingBlank>
            <Button type="primary" onClick={() => this.order()}>
              支付
              {this.state.totlePrice == 0
                ? ""
                : "¥" + this.state.totlePrice / 100}
            </Button>
          </WingBlank>

          <WhiteSpace />
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
                  if (window.AppBridge) {
                    return window.AppBridge.exit();
                  } else {
                    this.props.history.goBack();
                  }
                }
              }
            ]}
            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          >
            <p style={{ fontSize: "14px" }}>支付尚未完成，确定要离开？</p>
          </Modal>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  hotelOrder: state.orderReducer.hotelOrder
});

function mapDispatchToProps(dispatch) {
  return {
    setHotelOrder: bindActionCreators(setHotelOrder, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(createForm()(HotelOrderDetailsPage));
