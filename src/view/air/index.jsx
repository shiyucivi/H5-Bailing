import React from "react";
import { connect } from "react-redux";
import { InputItem, Toast, Button, WingBlank, WhiteSpace } from "antd-mobile";
import { createForm } from "rc-form";

import { bindActionCreators } from "redux";
import { setOrder, setPansengers } from "../../reducer/action";
import "./index.scss";

import { isAndroidOrios, getAirData, exit } from "../../util/fetch";
import Nav from "../../components/nav";
import NavAudio from "../../components/nav/audio_nav";

import CardAir from "../../components/card/air";
import PayMent from "../../components/pay";
import Timeout from "../../components/timeout";
import API from "../../config/api/";
import { renderAirInfo } from "./airFlightInfo";
import AudioButton from "../../components/button/PayConfirmButton";
let DEVICE = "";

class AirDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // json: this.props.match.params.json,
      showToast: false,
      editable: false,
      BaseInfo: {},
      payType: "",
      isOrder: false,
      priceList: {},
      isPay: false,
      timeoutNum: 0.1,

      timeoutFalg: false,
      priceReaultList: {},
      totlePrice: 0
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
    /**
     *修改联系人姓名
     *
     */
    window["_EDIT_CONTACT_NAME"] = phone => {
      this.props.form.setFieldsValue({
        contact_info_name: phone
      });
    };
  }
  componentDidMount() {
    // 获取参数 判断是否为下单页面
    const BaseInfo = this.props.match.params.id;
    if (BaseInfo) {
      // 查询详情
      this.fetchOrderDetail();
    } else {
      let result = "";

      if (isAndroidOrios()[1]) {
        // ios下获取信息
        getAirData(null, res => {
          let result = JSON.parse(res);
          result.items = JSON.parse(result.items);
          result.summary = JSON.parse(result.summary);
          result.summary.extra_lvl1.commodity_category = 4;
          let _temp = {
            business_ext: result.items.business_ext,
            dpt_date: result.items.start_date,
            cabin: result.items.cabin,
            punctuality_rate: result.items.correct,
            extra_lvl2: JSON.stringify(result.items.extra_lvl2),
            arr: result.items.dst_city_code,
            adult_bare_price: result.items.bare_price,
            flight_num: result.items.flight_no,
            dpt_time: result.items.start_time,
            meal: result.items.meal,
            extra_lvl1: JSON.stringify(result.summary.extra_lvl1),
            carrier: result.items.carrier,
            dpt: result.items.org_city_code
          };
          this.preOrder(_temp);
        });
      }
      // 安卓下获取信息
      if (isAndroidOrios()[0] && window.AppBridge) {
        //维护手机 音响类别 支付方式不同
        if (window.AppBridge && window.AppBridge.getSystemModel) {
          DEVICE = window.AppBridge.getSystemModel();
        }
        result = JSON.parse(window.AppBridge.getAirTicketData());
        result.items = JSON.parse(result.items);
        result.summary = JSON.parse(result.summary);
        result.summary.extra_lvl1.commodity_category = 4;
        let _temp = {
          business_ext: result.items.business_ext,
          dpt_date: result.items.start_date,
          cabin: result.items.cabin,
          punctuality_rate: result.items.correct,
          extra_lvl2: JSON.stringify(result.items.extra_lvl2),
          arr: result.items.dst_city_code,
          adult_bare_price: result.items.bare_price,
          flight_num: result.items.flight_no,
          dpt_time: result.items.start_time,
          meal: result.items.meal,
          extra_lvl1: JSON.stringify(result.summary.extra_lvl1),
          carrier: result.items.carrier,
          dpt: result.items.org_city_code
        };
        this.preOrder(_temp);
      }

      this.setState({
        BaseInfo: BaseInfo,
        isOrder: true
      });
    }

    let passengers = this.props.pansengers;
    if (passengers) {
      this.compuutedPrice_fororder();
    } else {
      this.fetchUserListForRender();
    }
  }
  compuutedPrice_fororder = () => {
    let passengers = this.props.pansengers;

    // 价格计算
    let priceList = [];
    let resultList = {};
    for (let i = 0; i < passengers.length; i++) {
      const element = passengers[i];
      switch (element.passengerAgeType) {
        case "0":
          priceList.push(
            {
              label: "成人",
              value: this.props.order.price_info.adult_bare_price
            },
            {
              label: "机建费用",
              value: this.props.order.price_info.arf
            },
            {
              label: "燃油费用",
              value: this.props.order.price_info.tof
            }
          );
          break;
        case "1":
          priceList.push(
            {
              label: "儿童",
              value: this.props.order.price_info.child_bare_price
            },
            {
              label: "机建费用",
              value: this.props.order.price_info.arf
            },
            {
              label: "儿童燃油费",
              value: this.props.order.price_info.child_tof
            }
          );
          break;
        case "2":
          priceList.push({
            label: "婴儿",
            value: this.props.order.price_info.baby_bare_price
          });
          break;
      }
    }
    priceList.forEach(item => {
      if (!resultList[item.label]) {
        resultList[item.label] = {
          num: 1,
          value: item.value
        };
      } else {
        resultList[item.label] = {
          num: resultList[item.label].num + 1,
          value: resultList[item.label].value + item.value
        };
      }
    });

    let totlePrice = 0;
    priceList.forEach(item => {
      totlePrice += item.value;
    });
    this.setState({
      priceReaultList: resultList,
      totlePrice: totlePrice
    });
  };
  fetchOrderDetail = () => {
    API.getOrderDetail({ order_code: this.props.match.params.id }).then(res => {
      console.log("res", res);
      if (res.order_code) {
        this.props.setOrder(res);
        if (
          res.order_status_name == "待支付" ||
          res.order_status_name == "订单创建"
        ) {
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
        if (distance < 15) {
          this.setState({
            timeoutFalg: true,
            timeoutNum: 15 - distance
          });
        }
        if (res.contact_info) {
          this.props.form.setFieldsValue({
            contact_info_mobile: res.contact_info.mobile,
            contact_info_name: res.contact_info.name
          });
        }
        // 价格计算
        if (res.product_items) {
          const arr = res.product_items;
          const price_info = res.price_info;

          this.setState({
            priceList: this.compuutedPrice(arr, price_info)
          });
        }
      } else {
        Toast.info("订单无效", 2);
        // this.props.history.replace("/");
      }
    });
  };
  compuutedPrice = (arr, price_info) => {
    let priceList = [];
    let resultList = {};

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      switch (element.product_desc) {
        case "成人":
          priceList.push(
            {
              label: "成人",
              value: price_info.adult_bare_price
            },
            {
              label: "机建费用",
              value: price_info.arf
            },
            {
              label: "燃油费用",
              value: price_info.tof
            }
          );

          break;
        case "儿童":
          priceList.push(
            {
              label: "儿童",
              value: price_info.child_bare_price
            },
            {
              label: "机建费用",
              value: price_info.arf
            },
            {
              label: "儿童燃油费",
              value: price_info.child_tof
            }
          );
          break;
        case "婴儿":
          priceList.push({
            label: "婴儿",
            value: price_info.baby_bare_price
          });
          break;
      }
    }

    priceList.forEach(item => {
      if (!resultList[item.label]) {
        resultList[item.label] = {
          num: 1,
          value: item.value
        };
      } else {
        resultList[item.label] = {
          num: resultList[item.label].num + 1,
          value: resultList[item.label].value + item.value
        };
      }
    });
    console.log("====================================");
    console.log(resultList);
    console.log("====================================");
    return resultList;
  };
  /**
   *后退回调
   *
   * @param {*} id
   * @param {*} name
   * @memberof AirDetailPage
   */
  returnData(arr) {
    console.log("====================================");
    console.log(arr);
    console.log("====================================");
  }
  /**
   *更改支付方式
   *
   * @param {*} payType
   * @memberof AirDetailPage
   */
  handelChangePay = payType => {
    this.setState({
      payType: payType
    });
  };
  toast = () => {
    this.setState({ showToast: !this.state.showToast });
  };
  /**
   *navigate
   *
   * @memberof orderListPage
   */
  navto = navName => {
    if (navName !== "edit_contact") {
      // 修改联系人
      console.log("====================================");
      console.log(this.props);
      console.log("====================================");
      this.props.history.push("/userList");
    } else {
      this.setState({
        editable: !this.state.editable
      });
    }
  };
  /**
   *预下单
   *
   * @memberof AirDetailPage
   */
  preOrder = params => {
    API.preOrder(params, "air").then(res => {
      if (res.status == 0 && res.message == "SUCCESS") {
        this.props.setOrder(res.data);
      } else {
        Toast.info(res.message.toString(), 2);
      }
    });
  };
  /**
   *下单
   *
   * @memberof AirDetailPage
   */
  order = () => {
    if (this.state.isOrder) {
      this.props.form.validateFields((error, value) => {
        if (!error) {
          let obj = {
            cid: this.props.order.cid,
            contact: value.contact_info_name,
            contact_phone: value.contact_info_mobile,
            need_itinerary: false,
            insurance_invoice: false,
            itinerary_price: null,
            punctuality_rate: this.props.order.flight_ext_info.punctuality_rate,
            carrier_name: this.props.order.flight_info.carrier_name,
            meal: true,
            total_price: this.state.totlePrice,
            passengers: this.props.pansengers
          };
          API.order(obj, "air").then(res => {
            if (res.status == 0 && res.message == "SUCCESS") {
              this.props.setOrder(res.data);
              Toast.info("下单成功", 2);
              this.setState({
                // isOrder: false,
                // isPay: true
              });
              // 跳转酒店支付页面 pay
              if (DEVICE) {
                // 音响跳转音响订单确认页面
                this.props.history.push(
                  `/order/air/pay_audio/${res.data.order_code}`
                );
              } else {
                this.props.history.push(
                  `/order/air/pay/${res.data.order_code}`
                );
              }
            } else {
              Toast.info(res.message, 2);
            }
          });
        } else {
          Toast.info(error[Object.keys(error)[0]].errors[0].message, 2);
        }
      });
    } else {
      let obj = {
        order_code: this.props.order.order_code,
        pay_channel: this.state.payType == "ali" ? 8 : 7
      };
      this.pay(obj);
    }
  };
  pay = obj => {
    API.pay(obj);
  };
  // 取消支付
  cancelOrder = () => {
    API.cancelOrder({
      order_code: this.props.order.order_code
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
  // 拉取乘机人信息填表
  fetchUserListForRender = () => {
    API.getUserList().then(res => {
      if (res.status == 0 && res.msg == "SUCCESS") {
        if (res.data && res.data !== []) {
          // 回填第一个乘机人
          this.props.setPansengers(res.data);
          this.props.form.setFieldsValue({
            contact_info_mobile: res.data[0].passengerMobile,
            contact_info_name: res.data[0].passengerFullName
          });
          this.compuutedPrice_fororder();
        }
      } else {
        Toast.info(res.msg, 3);
      }
    });
  };
  render() {
    const { getFieldProps } = this.props.form;
    const isAudio = DEVICE;
    const order_info = () => (
      <CardAir
        title={
          this.props.order.order_status_name !== "待支付"
            ? "订单信息"
            : "订单总额"
        }
      >
        <div>
          {Object.keys(priceList).map((item, index) => (
            <p key={index} className="edit">
              <span>{item}</span>
              <span
                style={{
                  width: "150px"
                }}
                className="edit"
              >
                <span>X{priceList[item].num}</span>
                <span>¥{priceList[item].value}/人</span>
              </span>
            </p>
          ))}
          {this.props.order.order_code && !this.state.isOrder && (
            <div>
              <WhiteSpace />

              {this.props.order.order_status_name !== "待支付" && (
                <p className="editLeft">
                  <span className="editspan">订单总价</span>
                  <span>¥{this.props.order.total_price}</span>
                </p>
              )}

              <p className="editLeft">
                <span className="editspan">订单编号</span>
                <span>{this.props.order.order_code}</span>
              </p>
              <p className="editLeft">
                <span className="editspan">下单时间</span>
                <span>{this.props.order.timeout}</span>
              </p>
            </div>
          )}
        </div>
      </CardAir>
    );
    const user_info = () => (
      <CardAir
        title="乘机人"
        titleR={
          this.state.isOrder && (
            <span
              onClick={() => this.navto("edit-userInfo")}
              style={{ color: "#1687FF" }}
            >
              {/* 音响和移动端样式不同 */}
              {this.props.pansengers && this.props.pansengers.length > 0 ? (
                "修改乘机人"
              ) : (
                <div>
                  {DEVICE ? (
                    <div className="add_btn">+ 添加</div>
                  ) : (
                    <div>添加乘机人</div>
                  )}
                </div>
              )}
            </span>
          )
        }
      >
        <div>
          {this.state.isOrder &&
            (this.props.pansengers || []).map(item => (
              <div key={item.passengerCardID}>
                <p>
                  {item.passengerFullName}{" "}
                  <span className="edit_l">{item.passengerMobile}</span>
                </p>
                <p>
                  <img
                    style={{ width: "15px", height: "15px" }}
                    src={require("../../assets/icon/ic_orders_airticket_idcard@2x.png")}
                  />{" "}
                  <span>{item.passengerCardID}</span>
                </p>
              </div>
            ))}
          {/* 详情 */}
          {!this.state.isOrder &&
            this.props.order.product_items &&
            (this.props.order.product_items || []).map(item => (
              <div key={item.product_name}>
                <p>
                  {item.product_name}{" "}
                  {/* <span style={styles.edit_l}>{item.passengerMobile}</span> */}
                </p>
                <p>
                  <img
                    style={{ width: "15px", height: "15px" }}
                    src={require("../../assets/icon/ic_orders_airticket_idcard@2x.png")}
                  />{" "}
                  <span>{item.attributes[1].value}</span>
                </p>
              </div>
            ))}
        </div>
      </CardAir>
    );

    let priceList;

    if (this.state.isOrder) {
      priceList = this.state.priceReaultList;
    } else {
      priceList = this.state.priceList;
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
              title="航班信息"
              titleR={
                this.state.isOrder ? (
                  <span onClick={this.toast} className="edit">
                    <img
                      style={{
                        width: "13px",
                        height: "13px",
                        marginRight: "5px"
                      }}
                      src={require("../../assets/icon/ic_orders_airticket_sign@2x.png")}
                    />
                    <span style={{ fontSize: "13px" }}>
                      查看退改签和行李说明
                    </span>
                  </span>
                ) : (
                  <div className="time">
                    {/* 倒计时 */}
                    {this.state.timeoutFalg && (
                      <Timeout
                        time={this.state.timeoutNum}
                        callBack={() => {}}
                      />
                    )}
                    {this.props.order.order_status_name}
                  </div>
                )
              }
            >
              <WhiteSpace />

              {/* 航班信息上 */}
              <div style={{ position: "relative" }}>
                {this.state.showToast && (
                  <div className="toast_info toast">
                    <p>
                      {this.props.order.baggage_rule.baby_baggage[0]}
                      <br />
                      {this.props.order.change_info.change_text}
                    </p>
                  </div>
                )}
              </div>
              {renderAirInfo(this.props.order)}
            </CardAir>
            {/* 用户信息或者价格信息 */}
            {/* 音响设备和手机排序不一样 */}

            {isAudio ? order_info() : user_info()}
          </div>
          <div>
            {isAudio ? user_info() : order_info()}
            <CardAir title="联系人信息">
              <div>
                <span className="edit">
                  <div className="flexR">
                    <InputItem
                      clear
                      {...getFieldProps("contact_info_name", {
                        onChange() {},
                        rules: [
                          { required: true, message: "姓名不能为空" },
                          {
                            message: "姓名不正确",
                            pattern: /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/
                          }
                        ]
                      })}
                      placeholder="姓名"
                      editable={this.state.isOrder}
                      ref={el => (this.autoFocusInst = el)}
                      maxLength="4"
                    />
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
                    />
                  </div>
                  {this.state.isOrder && (
                    <img
                      style={{ width: "18px", height: "18px" }}
                      onClick={() => this.navto("edit_contact")}
                      src={require("../../assets/icon/ic_orders_airticket_edit@2x.png")}
                    />
                  )}
                </span>
              </div>
            </CardAir>
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
            <WingBlank>
              {(this.state.isPay || this.state.isOrder) && !DEVICE && (
                <Button type="primary" onClick={() => this.order()}>
                  {this.state.isOrder ? "提交订单" : "支付"}

                  {this.state.totlePrice == 0
                    ? ""
                    : "¥" + this.state.totlePrice}
                </Button>
              )}

              {DEVICE && (
                <div>
                  <p className="totlePrice">
                    {this.state.totlePrice == 0 ? (
                      ""
                    ) : (
                      <span className="yellow_text">
                        总价:¥ {this.state.totlePrice}
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
            <WhiteSpace />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  order: state.orderReducer.order,
  pansengers: state.orderReducer.pansengers
  // contactInfo: state.contactInfo
});

function mapDispatchToProps(dispatch) {
  return {
    setOrder: bindActionCreators(setOrder, dispatch),
    setPansengers: bindActionCreators(setPansengers, dispatch)

    // setContactInfo: bindActionCreators(contactInfo, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(createForm()(AirDetailPage));
