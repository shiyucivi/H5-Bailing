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
import "./index.scss";
import { createForm } from "rc-form";
import Nav from "../../components/nav";
import NavAudio from "../../components/nav/audio_nav";

import CardAir from "../../components/card/air";
import PayMent from "../../components/pay";
import Timeout from "../../components/timeout";
import Stepper from "../../components/stepper";
import API from "../../config/api/";

import { isAndroidOrios, getHotelData, exit } from "../../util/fetch";

import { renderItem } from "../order";
import { setHotelOrder } from "../../reducer/action";
import { bindActionCreators } from "redux";
import AudioButton from "../../components/button/PayConfirmButton";

const Item = List.Item;
let DEVICE = "";

class HotelOrderDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BaseInfo: {},
      isOrder: false,
      isPay: false,
      totlePrice: 0,
      payType: "",
      id: this.props.match.params.id,
      summary: {},
      items: {},
      roomNum: 1,
      timeoutNum: 0.1,
      timeoutFalg: false,
      editable: false,
      showDialog: false,
      dateRange: ["16:00", "17:00", "18:00", "19:00", "20:00"],
      arrTime: "16:00" //到店时间
    };
  }
  componentWillMount() {
    /**
     *下一步、下单、锁座”
     *
     */
    window["_NEXT"] = () => {
      this.order();
    };
    /**
     *修改手机号
     *
     */
    window["_EDIT_CONTACT_PHONE"] = phone => {
      this.props.form.setFieldsValue({
        contact_info_mobile: phone
      });
    };
  }
  componentDidMount() {
    // 获取参数 判断是否为下单页面
    const BaseInfo = !this.props.match.params.id;

    if (!BaseInfo) {
      // 无订单信息
      this.fetchOrderDetail();
    } else {
      let result = "";
      if (isAndroidOrios()[1]) {
        // ios下获取信息
        getHotelData(null, res => {
          this.setParamas(JSON.parse(res));
        });
      }
      // 安卓下获取信息
      if (isAndroidOrios()[0] && window.AppBridge) {
        //维护手机 音响类别 支付方式不同
        if (window.AppBridge.getSystemModel) {
          DEVICE = window.AppBridge.getSystemModel();
        }
        result = JSON.parse(window.AppBridge.getHotelData());
        result.summary = JSON.parse(result.summary);
        result.items = JSON.parse(result.items);
        this.setParamas(result);
      }
    }
  }
  defaultUserInfo = params => {
    API.defaultUserInfo(params).then(res => {
      if (res.status == 0) {
        let data = res.data.default_user_info;
        if (data && data.length > 0) {
          data.map(item => {
            if (item.is_contact == 1) {
              this.props.form.setFieldsValue({
                contact_info_name0: item.name,
                contact_info_mobile: item.mobile
              });
            }
          });
        }
      }
    });
  };
  setParamas = result => {
    if (typeof result == "string") {
      result = JSON.parse(result);
    }
    const BaseInfo = !this.props.match.params.id;
    let obj;
    if (result) {
      let summary = result.summary;
      let items = result.items;

      this.setState({
        summary: summary,
        items: items
      });
      obj = {
        address: summary.hotel.address,
        room_name: items.room_name,
        order_name: summary.hotel.name,
        checkin_date: summary.chickin_date,
        checkout_date: summary.chickout_date,
        show_pic_url: summary.hotel.front_image,
        checkin_names: "",
        checkin_tips: "",
        stay_day_num: summary.stay_day_num,
        comment: "",
        commodity_category: 3,
        detail: [
          items.useable_area,
          items.breakfast_type,
          items.internet_way,
          items.window
        ],
        product_items: [
          {
            unit_price: items.sale_price_sum1
          }
        ],
        maxRoom: 10,
        minRoom: 10,
        sale_price_sum1: items.sale_price_sum1
      };
    }
    this.props.setHotelOrder(obj);
    //回填联系人信息
    this.defaultUserInfo({
      extra_lvl1: JSON.stringify(result.summary.extra_lvl1),
      extra_lvl2: JSON.stringify(result.items.extra_lvl2)
    });
    this.setState({
      BaseInfo: BaseInfo,
      isOrder: true
    });
  };
  /**
   *下单
   *
   * @memberof AirDetailPage
   */
  fetchOrderDetail = (params = { order_code: this.props.match.params.id }) => {
    API.getOrderDetail(params).then(res => {
      if (res.create_time) {
        console.log("res", res);
        res.detail = res.product_items[0].product_desc.split(";");
        this.props.setHotelOrder(res);
        //房间数
        this.setState({
          roomNum: res.roomNum,
          totlePrice: res.total_price * 100
        });
        if (res.order_status_name == "待支付") {
          this.setState({
            isPay: true
          });
        }
        // 判断订单是否超时 并显示超时定时器
        // eslint-disable-next-line no-unused-expressions
        var now = new Date();
        var ago = new Date(res.create_time.replace("//-/g", "//"));
        var distance = (
          parseInt(now.getTime() - ago.getTime()) /
          1000 /
          60
        ).toFixed(1);
        console.log("====================================");
        console.log("已经过了" + distance + "m");
        console.log("====================================");
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
        Toast.info("订单无效", 2);
      }
    });
  };
  //切换支付方式
  handelChangePay = payType => {
    this.setState({
      payType: payType
    });
  };
  //入住弹窗
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
    if (this.state.isOrder) {
      this.props.form.validateFields((error, value) => {
        // 取出入住人信息
        let checkin_namesList = [];
        Object.keys(value).map((item, index, arr) => {
          if (item !== "contact_info_mobile") {
            checkin_namesList.push(value[item]);
          }
        });

        checkin_namesList =
          checkin_namesList.length > 1
            ? checkin_namesList.join(",")
            : checkin_namesList[0];
        if (!error) {
          let obj = {
            hotel_id: this.state.items.hotel_id,
            goods_id: this.state.items.goods_id,
            checkin_date: this.state.summary.chickin_date,
            checkout_date: this.state.summary.chickout_date,
            arrive_time: `${this.state.summary.chickin_date} ${
              this.state.arrTime
            }:00`,
            checkin_names: checkin_namesList,
            contact_phone: value["contact_info_mobile"],
            room_num: this.state.roomNum,
            total_price: this.state.totlePrice / 100,
            extra_lvl1: JSON.stringify(this.state.summary.extra_lvl1),
            extra_lvl2: JSON.stringify(this.state.items.extra_lvl2)
          };
          // alert(JSON.stringify(obj));

          API.order(obj, "hotel").then(res => {
            if (res.status == 0 && res.message == "SUCCESS") {
              // this.props.setHotelOrder(res.data);
              Toast.info("下单成功", 2);
              this.setState({
                isOrder: false,
                timeoutFalg: true,
                isPay: true
              });
              // alert(JSON.stringify(res.data));
              // 跳转酒店支付页面 pay
              if (DEVICE) {
                // 音响跳转音响订单确认页面
                this.props.history.push(
                  `/order/hotel/pay_audio/${res.data.order_code}`
                );
              } else {
                this.props.history.push(
                  `/order/hotel/pay/${res.data.order_code}`
                );
              }
            } else {
              Toast.info(res.message, 2);
              // window.location.reload();
            }
          });
        } else {
          Toast.info(error[Object.keys(error)[0]].errors[0].message, 2);
        }
      });
    } else {
      let obj = {
        order_code: this.props.hotelOrder.order_code,
        pay_channel: this.state.payType == "ali" ? 8 : 7
      };
      API.pay(obj);
    }
  };
  // 取消支付
  cancelOrder = () => {
    API.cancelOrder({
      order_code: this.props.hotelOrder.order_code
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
  render() {
    const { getFieldProps } = this.props.form;
    const isAudio = DEVICE;
    let order = this.props.hotelOrder;
    order.show = true;

    let room_person = [];
    let arr = this.state.roomNum;

    for (var i = 0; i < arr; i++) {
      // var item = this.state.roomNum[i];
      room_person.push(
        <InputItem
          key={i}
          clear
          {...getFieldProps(`contact_info_name${i}`, {
            onChange() {},
            rules: [
              { required: true, message: "姓名不能为空" },
              {
                message: "姓名不正确",
                pattern: /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/
              }
            ]
          })}
          placeholder="入住人姓名"
          editable={this.state.isOrder}
          // ref={el => (this.autoFocusInst1 = el)}
          maxLength="11"
        >
          入住人{i + 1}
        </InputItem>
      );
    }
    return (
      <div className="wrap">
        {isAudio ? (
          <NavAudio
            title={this.state.isOrder ? "订单确认" : "订单详情"}
            leftButton
            leftButtonClick={() => {
              if (this.state.isOrder) {
                return exit();
              } else {
                return this.props.history.goBack();
              }
            }}
          />
        ) : (
          <Nav
            title={this.state.isOrder ? "订单确认" : "订单详情"}
            leftButton
            leftButtonClick={() => {
              if (this.state.isOrder) {
                return exit();
              } else {
                return this.props.history.goBack();
              }
            }}
          />
        )}

        <div className="wrap_content">
          <div>
            <CardAir
              title="酒店信息"
              titleR={
                this.state.isOrder ? (
                  <div>
                    {this.state.timeoutFalg && (
                      <Timeout
                        time={this.state.timeoutNum}
                        callBack={() => {}}
                      />
                    )}
                  </div>
                ) : (
                  <div className="time">
                    {/* 倒计时 */}
                    {this.state.timeoutFalg && (
                      <Timeout
                        time={this.state.timeoutNum}
                        callBack={() => {}}
                      />
                    )}
                    {this.props.hotelOrder.order_status_name}
                  </div>
                )
              }
            >
              {/* 酒店信息 */}
              <div>
                <div>{order.commodity_category && renderItem(order)}</div>
                <p>地址 {order.address}</p>
                {order.merchant_contact && <p>电话 {order.merchant_contact}</p>}
              </div>
            </CardAir>
            {/* 预订信息 */}
            {/* 分为填充和正常填写 样式不一样 */}
            {this.state.isOrder ? (
              <CardAir title="预订信息">
                <div>
                  <List>
                    <Item>
                      <div className="flexR">
                        <span>预订数量</span>

                        <Stepper
                          min={1}
                          max={order.maxRoom}
                          value={this.state.roomNum}
                          callback={value => {
                            this.setState({
                              roomNum: value,
                              totlePrice:
                                value * this.state.items.sale_price_sum1
                            });
                          }}
                        />
                      </div>
                    </Item>
                    <Item>
                      <div className="flexR">
                        <span>预订价格</span>
                        <span>￥{order.sale_price_sum1 / 100}/间</span>
                      </div>
                    </Item>
                    <Item>
                      <div className="flexR">
                        <span>入住时间</span>
                        <span
                          className="flexR"
                          onClick={() => {
                            this.changeTime();
                          }}
                        >
                          {this.state.arrTime}之前
                          <img
                            style={{
                              width: "18px",
                              height: "18px",
                              margin: "10px"
                            }}
                            src={require("../../assets/icon/ic_orders_hotel_number_arrow_down@2x.png")}
                          />
                        </span>
                      </div>
                    </Item>
                  </List>
                </div>
              </CardAir>
            ) : (
              <CardAir title="预订信息">
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
          </div>
          <div>
            {/* 样式不一样 */}
            <CardAir title="入住人信息">
              <List>
                {/* 填写入住人 */}
                {room_person}

                {!this.state.isOrder &&
                  this.props.hotelOrder.checkin_names
                    .split(",")
                    .map((i, index) => (
                      <InputItem
                        key={i}
                        clear
                        {...getFieldProps(`contact_info_name${i}`, {
                          onChange() {},
                          rules: [
                            { required: true, message: "姓名不能为空" },
                            {
                              message: "姓名不正确",
                              pattern: /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/
                            }
                          ]
                        })}
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
                  {...getFieldProps("contact_info_mobile", {
                    onChange() {},
                    rules: [
                      { required: true, message: "手机号码不能为空" },
                      {
                        message: "手机号码不正确",
                        pattern: /^1[3456789]\d{9}$/
                      }
                    ]
                  })}
                  placeholder="手机号码"
                  editable={this.state.isOrder}
                  ref={el => (this.autoFocusInst1 = el)}
                  maxLength="11"
                >
                  联系方式
                </InputItem>
              </List>
            </CardAir>
            {/* 支付方式 */}
            {!this.state.isOrder && this.state.isPay && (
              <div>
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
              </div>
            )}
            {/* 支付按钮 */}
            <WingBlank>
              {(this.state.isPay || this.state.isOrder) && !DEVICE && (
                <Button type="primary" onClick={() => this.order()}>
                  {this.state.isOrder ? "提交订单" : "支付"}

                  {this.state.totlePrice == 0
                    ? ""
                    : "¥" + this.state.totlePrice / 100}
                </Button>
              )}
              {DEVICE && (
                <div>
                  <p className="totlePrice">
                    {this.state.totlePrice == 0 ? (
                      ""
                    ) : (
                      <span className="yellow_text">
                        总价:¥ {this.state.totlePrice / 100}
                      </span>
                    )}
                  </p>
                  <div onClick={() => this.order()}>
                    <AudioButton buttonType="confirm" content="提交订单" />
                  </div>
                  <p className="xiechenginfo">携程酒店电话：95010</p>
                </div>
              )}
            </WingBlank>
            <WhiteSpace size="lg" />
            <WingBlank>
              {!this.state.isOrder && this.state.isPay && (
                <div className="cancel" onClick={() => this.cancelOrder()}>
                  取消订单
                </div>
              )}
            </WingBlank>
            <WhiteSpace size="lg" />
            {/* 时间抵达弹窗 */}
            <Modal
              visible={this.state.showDialog}
              style={{ position: "fixed", bottom: 30 }}
              transparent
              maskClosable={false}
              onClose={this.onClose("showDialog")}
              title="预计到店时间"
              wrapProps={{ onTouchStart: this.onWrapTouchStart }}
            >
              <div
                style={{
                  height: 200,
                  overflow: "scroll"
                }}
              >
                {/* 时间选择 */}
                {this.state.dateRange.map(val => {
                  return (
                    <p
                      key={val}
                      className={
                        this.state.arrTime == val
                          ? "dateItemSelectd"
                          : "dateItem"
                      }
                      onClick={() => this.changeArrTime(val)}
                    >
                      {val}
                    </p>
                  );
                })}
              </div>
            </Modal>
          </div>
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
