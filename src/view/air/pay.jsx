import React from "react";
import { connect } from "react-redux";
import {
  InputItem,
  Toast,
  Button,
  WingBlank,
  WhiteSpace,
  Modal
} from "antd-mobile";
import "./index.scss";
import { bindActionCreators } from "redux";
import { setOrder } from "../../reducer/action";
import { createForm } from "rc-form";
import Nav from "../../components/nav";
import CardAir from "../../components/card/air";
import PayMent from "../../components/pay";
import Timeout from "../../components/timeout";
import API from "../../config/api/";

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
      modal1: false,
      showTable: false,
      priceList: [],
      totlePrice: 0
    };
  }
  componentDidMount() {
    // 获取参数 判断是否为下单页面
    const BaseInfo = !this.props.match.params.id;

    if (!BaseInfo) {
      // 无订单信息
      // Toast.info("订单详情", 1);
      this.fetchOrderDetail();
    } else {
      // Toast.info("下单", 1);
      let result = "";
      if (window.AppBridge) {
        result = JSON.parse(window.AppBridge.getAirTicketData());
        result.extra_lvl2 = JSON.stringify(result.extra_lvl2);
      }
      this.preOrder(result);
      this.setState({
        BaseInfo: BaseInfo,
        isOrder: true
      });
    }

    let passengers = this.props.pansengers;
    if (passengers) {
      // 价格计算
      let priceList = [];
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

      console.log(priceList);
      let totlePrice = 0;
      priceList.forEach(item => {
        totlePrice += item.value;
      });
      this.setState({
        priceList: priceList,
        totlePrice: totlePrice
      });
    }
  }
  fetchOrderDetail = () => {
    API.getOrderDetail({ order_code: this.props.match.params.id }).then(res => {
      console.log("res", res);
      if (res) {
        this.props.setOrder(res);
        if (res.contact_info) {
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
          // 价格计算
          if (res.product_items) {
            const arr = res.product_items;
            const price_info = res.price_info;

            this.setState({
              priceList: this.compuutedPrice(arr, price_info)
            });
          }
          this.props.form.setFieldsValue({
            contact_info_mobile: res.contact_info.mobile,
            contact_info_name: res.contact_info.name
          });
        }
      } else {
        this.props.history.replace("/");

        Toast.info("订单无效", 2);
      }
    });
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
  onClose = key => () => {
    console.log("====================================");
    console.log(key);
    console.log("====================================");
    this.setState({
      [key]: false
    });
  };
  /**
   *预下单
   *
   * @memberof AirDetailPage
   */
  preOrder = params => {
    let extra_lvl2 = {
      bare_price: 1427,
      remain_num: 99,
      discount: "6.4",
      agent_domain: "gek.trade.qunar.com",
      flight_no: "CA1817",
      is_ad: 0,
      end_date: "2019-06-29",
      policy_type: "1",
      end_time: "10:55",
      dst_city_code: "NKG",
      start_time: "08:50",
      correct: "85%",
      insurance_fee: "",
      product_tag: "OPL4",
      company: "中国国航",
      duration: "02:05",
      org_city_code: "PEK",
      base_price: 0,
      org_station: "首都机场",
      carrier: "CA",
      business_ext:
        "Vma/KC3/v9FG2M3TO/nM1PuGNNpMFcx0K1uWOUf9LM0HBk/bTXd0YfN22F1v5eYxWLn0HBs84PpxeZS8HmEm6XikhdCtCXr9MPADOfz7QjLhqUsPrVLMVofQMYAD1C3rs/46BoLDZdMHdGlen00hegXuXeyLXW2yjSJ3nh4Rrst2uljEeYx43nuYQXxsUvZ0XT890AyFkJUCuS4TB+YgtMilvkR47UxvgusH5kYwSK8AqtrnbrO8nIeA3ubVhvBTRcspno+BjM3M4nVKh+mgH6+FTnbuWSEW3b7hQXDOyq1xy1VmXUz/n0x3JhJDOAkoODJK6wJ0MTfxxzrgN9jYG6KmqsTSTRxy8obygwFINYVCs7vWb/ZzQVoZ4h/UatcDPjITCryjN2ouOdq5ZDJN8sBSQ3svnW19kaawICxk9P/XXFFqLfGZ+BedNeSFJwamR2cN4fy5IJQyGmbqnfuF8pYrpUzIQ/IIdXTME9njJBSZdgQsblTscvvesjdCMrEfnG+l1kCS3UccB0d1S0xqFkbBpP9xaIjrdKWWlycAFmxtlVxnVMMxgqLfi3HZ7HJpnuLywXFtMemA+i5Wgi8Ubk4PCv4VpL8akOBCROF2BqO1CEuKf4S6Oq9t6LXdlN9YcXDFNbju3wa4t/N3615dw9jYbzwmNSN5wPFYpO2ehY4EixzKyJ/+CsHz5DFHGpEM+WEIeGFvufPfq0vsomMV6lPkyulLX+BWWU78LSQ3M2TkUNSS3GgPhn7uFmkPDvr2ueKh6KZ2fnJiHS8vf4Kbh/1Ibrr6FayyW8hLgKAY3Oz3hyCeZ22st/UXeBtfph3YSG63LbUWWgFKCYBJFnBAVJ1arlFVe8nqRRI2EZ8ijz7BWc5SOXHlt0CQtCMRc/aJl7UcxwTW1KmNBtlah155W6csm27Tag9mQgbNRCT4YZqmIfeJ0448QZqYz+CIrm//vQpa8TYK6tlM3VX/GKKftF6HOtrqvg95SYlbZoIxWib0MB3+SBD6X5COX/eyb1es+PwK7d0DKDx4YzQSovSjwrAMcCBnuSFzV87lW7VEb5oDpbkL4GIzO5EI+f06EHOLL3BQi06vZL4/O1nGVQFzRFxMOHQfCqN0+giFRnaF88MU+8ZPYH05gAJ3BMVZHgIginWPmO+2m5oJitW8EwnzS/BYiyV6IARBwjInHl4JZ8sBI3teDAWz0b0kpFKOSCi1pu5qxlVjQrPMY6TR5md8kznd7XL67fFRwkto0iLfWcb21cvffm4TKJ5Xa+LY1EZ0KH/J6hGzQrK656XogFxFvpJW5f+TmO7p4dhMsJP25fhx5GDF119fzjigt4C0etOoHqAXpoYGcn1mNtFNneXoDuZecbhNmOVxcbwXMXYpCVwpmXhneDkPKc9w4DLNAK9K/nC2Y5h6Npt3L7fVa4F8i7N8rSoxsMvQtzCQxuQctXfoJ5dtMfGbCs/x9oQb4Fpc41EbgKiqMBFdMv7Xba8VKjm0uBgNX9SAINTAp5w620+EdJ6vIuAq1kdf4WMxX/I5tHthu2n4ag6m7kwK1tseUR1NJ1Oe0yjRep4DkQy1auBhCm2gNc1tWPG2z+SdcH0W",
      dst_station: "禄口机场",
      orgAirport_ter: "T3",
      price: 1427,
      airport_tax: 50,
      cabin: "Q",
      flight_type: "32A",
      wrapper_id: "ttsgndm1077",
      ticket_price: 1470,
      meal: true,
      start_week_day: "星期六",
      start_date: "2019-06-29",
      seat_name: "经济舱",
      policy_id: "368186019",
      fuel_tax: 0,
      dstAirport_ter: "T2"
    };
    let obj = {
      extra_lvl1: "{}",
      extra_lvl2: JSON.stringify(extra_lvl2),
      adult_bare_price: extra_lvl2.bare_price,
      dpt_date: extra_lvl2.end_date,
      carrier: extra_lvl2.carrier,
      flight_num: extra_lvl2.flight_no,
      cabin: extra_lvl2.cabin,
      dpt: extra_lvl2.org_city_code,
      arr: extra_lvl2.dst_city_code,
      dpt_time: extra_lvl2.start_time,
      punctuality_rate: extra_lvl2.correct,
      meal: extra_lvl2.meal
    };
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
    const obj = {
      order_code: this.props.order.order_code,
      pay_channel: this.state.payType == "ali" ? 8 : 7
    };
    API.pay(obj);
  };

  render() {
    const { getFieldProps } = this.props.form;
    const priceList = this.state.priceList;

    return (
      <div>
        <p onClick={() => this.props.history.push("/")}>home</p>
        <Nav
          title={"订单支付"}
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
            title="航班信息"
            titleR={
              <div>
                {this.state.timeoutFalg && (
                  <Timeout time={this.state.timeoutNum} callBack={() => {}} />
                )}
              </div>
            }
          >
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

              <div className="flex">
                <div className="topAir">
                  <span className="bgText">
                    {this.props.order.flight_info.dpt_city}
                  </span>
                  <span className="midText">
                    {this.props.order.flight_info.dpt_time}
                  </span>
                </div>
                <div className="topAir smText">
                  <div>{this.props.order.flight_info.flight_times}</div>
                  <div>
                    <img
                      style={{
                        width: "100%",
                        margin: "2px 0 5px",
                        boxSizing: "border-box"
                      }}
                      src={require("../../assets/icon/ic_orders_airticket_arrow_right@2x.png")}
                    />
                  </div>
                  <div>{this.props.order.flight_info.carrier_name}</div>
                </div>
                <div className="topAir">
                  <span className="bgText">
                    {this.props.order.flight_info.arr_city}
                  </span>
                  <span className="midText">
                    {this.props.order.flight_info.arr_time}
                  </span>
                </div>
              </div>
            </div>
            {/* 航班信息下 */}
            <div className="flexR midText gray">
              <div className="topAir">
                <span>
                  {this.props.order.flight_info.dpt_airport ||
                    this.props.order.flight_info.dpt_terminal}
                </span>
                <span>{this.props.order.flight_info.dpt_date}</span>
              </div>

              <div className="topAir">
                <span>
                  {this.props.order.flight_info.arr_airport ||
                    this.props.order.flight_info.arr_terminal}
                </span>
                <span>{this.props.order.flight_info.arr_date}</span>
              </div>
            </div>
          </CardAir>
          {/* 用户信息 */}
          {this.state.showTable && (
            <CardAir
              noMargin
              title="用户信息"
              titleR={
                this.state.isOrder && (
                  <span
                    onClick={() => this.navto("edit-userInfo")}
                    style={{ color: "#1687FF" }}
                  >
                    {this.props.pansengers.length > 0
                      ? "修改乘机人"
                      : "添加乘机人"}
                  </span>
                )
              }
            >
              <div>
                {this.state.isOrder &&
                  this.props.pansengers.map(item => (
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
                  this.props.order.product_items.map(item => (
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
          )}

          <CardAir
            className={this.state.showTable ? "show" : "hide"}
            noMargin
            title="联系人信息"
          >
            <div>
              <span sclassName="edit">
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

          {this.state.showTable && (
            <CardAir noMargin title="订单总额">
              <div>
                {this.props.order.order_code && !this.state.isOrder && (
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
                  </div>
                )}
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
          {!this.state.isOrder && (
            <CardAir title="支付方式">
              <PayMent changeType={this.handelChangePay} defaultPAy="ali" />
            </CardAir>
          )}
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
              {this.state.isOrder ? "下单" : "支付"}
              {this.state.totlePrice == 0 ? "" : this.state.totlePrice}
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
  order: state.orderReducer.order,
  pansengers: state.userReducer.pansengers
  // contactInfo: state.contactInfo
});

function mapDispatchToProps(dispatch) {
  return {
    setOrder: bindActionCreators(setOrder, dispatch)
    // setContactInfo: bindActionCreators(contactInfo, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(createForm()(AirDetailPage));
