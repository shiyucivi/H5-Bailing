import React, { Component } from "react";

import { Tabs, Badge } from "antd-mobile";
import { connect } from "react-redux";
import { setOrderTabs, setListState } from "../../reducer/action";
import { bindActionCreators } from "redux";
import moment from "moment";
import "./index.scss";
import List from "../../components/list";
import Nav from "../../components/nav";
const DEVICE = window.DEVICE_SYSTEM_CATEGORY;

const tabs = [
  { title: "全部", sub: "1" },
  { title: "待支付", sub: "2" },
  { title: "待使用", sub: "3" },
  { title: "已完成", sub: "4" }
];

const tabBarUnderlineStyle = {
  width: "8%",
  marginLeft: "8.5%",
  borderBottomWidth: "1px"
};
const tabBarTextStyle = {
  fontSize: "14px"
};
//酒店item
const stylesBox = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    paddingTop: "10px"
  },
  hotel_wrap_p: {
    lineHeight: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  hotel_wrap_title: {
    fontSize: "16px"
  },
  hotel_wrap_content: {
    fontSize: "14px",
    color: "#535366",
    whiteSpace: "nowrap"
  },
  hotel_wrap_content_item: {
    lineHeight: "15px"
  },
  hotel_wrap_content_item_sm: {
    lineHeight: "8px"
  },
  hotelImg: {
    width: "60px",
    height: "75px",
    marginRight: "20px"
  },
  hotelImgBig: {
    width: "60px",
    height: "85px",
    marginRight: "20px"
  },
  badge: {
    // marginLeft: 12,
    // padding: "0 3px",
    backgroundColor: "#fff",
    borderRadius: 2,
    color: "#535365",
    border: "1px solid #9999A3",
    borderRadius: "4px",
    marginRight: "5px",
    fontSize: "10px",
    lineHeight: "20px"
  },
  flexC: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    height: "60px"
  },
  aircontainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  airtitle: {
    fontSize: "16px"
  },
  grayText: {
    fontSize: "14px",
    color: "#9999A3",
    marginLeft: "20px"
  },
  payBtn: {
    width: "80px",
    height: "30px",
    color: "#fff",
    backgroundColor: "#1687FF",
    lineHeight: "30px",
    textAlign: "center",
    borderRadius: "6px",
    position: "absolute",
    top: "0",
    right: 0
  },
  hotelpayBtn: {
    width: "80px",
    height: "30px",
    color: "#fff",
    backgroundColor: "#1687FF",
    lineHeight: "30px",
    textAlign: "center",
    borderRadius: "6px",
    position: "absolute",
    top: "50%",
    right: 0,
    marginTop: "-15px"
  }
};

export const renderItem = obj => {
  switch (obj.commodity_category) {
    case 0:
      //电影
      return (
        <div className="movie_info_title">
          <p>
            <span>{obj.film_name}</span>
            <span>
              {` ${obj.film_row_column_no &&
                obj.film_row_column_no.split(";").length}`}
              张
            </span>
          </p>
          <p>{`${moment(obj.begin_time).format("MMM Do")} ${moment(
            obj.begin_time
          ).calendar()}  `}</p>
        </div>
      );
      break;
    case 2:
      //外卖
      return (
        <div className="takeout_info_title">
          <p>
            {`${obj.product_items[0].product_name}等 ${
              obj.product_items.length
            } 件商品`}

            <span>（{obj.delivery_type_name}）</span>
          </p>

          <p>{obj.address}</p>
        </div>
      );
      break;
    case 3:
      // 酒店
      return (
        <div className="hotel_info_title" style={stylesBox.container}>
          {!obj.show ? (
            <img style={stylesBox.hotelImg} src={obj.show_pic_url} />
          ) : (
            <img style={stylesBox.hotelImgBig} src={obj.show_pic_url} />
          )}

          <div style={stylesBox.hotel_wrap_p} className="audio_gray">
            <p style={stylesBox.hotel_wrap_title}>{obj.order_name}</p>

            <div style={stylesBox.hotel_wrap_content}>
              <p style={stylesBox.hotel_wrap_content_item_sm}>
                {obj.room_name}
              </p>
              {!obj.show && (
                <p style={stylesBox.hotel_wrap_content_item_sm}>
                  共 {obj.room_num}间 ¥{obj.product_items[0].unit_price}/间
                </p>
              )}
              {obj.show ? (
                <p style={stylesBox.hotel_wrap_content_item_sm}>
                  {/* 音响日期简略显示 */}
                  {DEVICE ? (
                    <span>
                      入住 {moment(obj.checkin_date).format("MM.DD")}-
                      {moment(obj.checkout_date).format("MM.DD")} 共
                      {obj.stay_day_num}天
                    </span>
                  ) : (
                    <span>
                      入住 {moment(obj.checkin_date).format("YYYY.MM.DD")}-
                      {moment(obj.checkout_date).format("YYYY.MM.DD")} 共
                      {obj.stay_day_num}天
                    </span>
                  )}
                </p>
              ) : (
                <p style={stylesBox.hotel_wrap_content_item_sm}>
                  {obj.checkin_date}-{obj.checkout_date} 共{obj.stay_day_num}天
                </p>
              )}

              {obj.show && (
                <div>
                  <Badge text={obj.detail[0] + "m"} style={stylesBox.badge} />
                  <Badge
                    text={obj.detail[1] == 0 ? "无早餐" : "有早餐"}
                    style={stylesBox.badge}
                  />
                  <Badge
                    text={obj.detail[2] == 0 ? "无Wi-Fi" : "有Wi-Fi"}
                    style={stylesBox.badge}
                  />
                  <Badge
                    text={obj.detail[3] == 0 ? "无窗" : "有窗"}
                    style={stylesBox.badge}
                  />
                </div>
              )}
            </div>
            {/* pay */}
            {!obj.show && obj.order_status_name == "待支付" && (
              <div style={stylesBox.hotelpayBtn}>支付</div>
            )}
          </div>
        </div>
      );
      break;
    case 4:
      return (
        <div>
          <div style={stylesBox.container}>
            <span style={stylesBox.container}>
              <span style={stylesBox.airtitle}>
                {" "}
                {obj.flight_info.dpt_city}
              </span>
              <img
                src={require("../../assets/icon/ic_ticketorder_chosesupplier_plane.png")}
                style={{
                  width: "20px",
                  height: "20px",
                  margin: "10px"
                }}
              />
              <span style={stylesBox.airtitle}>{obj.flight_info.arr_city}</span>
            </span>
            <span style={stylesBox.grayText}>{obj.flight_info.dpt_date}</span>
          </div>
          {/* 起飞时间 */}
          <div style={stylesBox.container}>
            <div style={stylesBox.flexC}>
              <span>{obj.flight_info.dpt_time}</span>
              <span>{obj.flight_info.arr_time}</span>
            </div>
            {/* icon */}
            <div>
              <img
                src={require("../../assets/icon/line_ordercenter.png")}
                style={{
                  width: "6px",
                  height: "52px",
                  margin: "10px"
                }}
              />
            </div>
            <div style={stylesBox.flexC}>
              <span>{obj.flight_info.dpt_terminal}</span>
              <span>{obj.flight_info.arr_terminal}</span>
            </div>
            {/* pay */}
            {obj.order_status_name == "待支付" && (
              <div style={stylesBox.payBtn}>支付</div>
            )}
          </div>
        </div>
      );
      break;
    default:
      return <div>null</div>;
      break;
  }
};
class TabExample extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    const nav = this.props;
    return (
      <div
        className=" order_page"
        style={{ position: "fixed", left: 0, top: 46, right: 0, bottom: 0 }}
      >
        <Nav className="wrap" title="订单中心" />
        <Tabs
          tabs={tabs}
          initialPage={this.props.tab}
          tabBarTextStyle={tabBarTextStyle}
          tabBarUnderlineStyle={tabBarUnderlineStyle}
          tabBarActiveTextColor="#1687FF"
          onChange={(tab, index) => {
            this.props.setOrderTabs(index);
            this.props.setListState({
              scrollTop: 0,
              datas: [],
              pageIndex: 0,
              page_size: 10,
              dataArr: []
            });
          }}
          onTabClick={(tab, index) => {}}
        >
          {/* 全部订单 */}
          {this.props.tab == 0 && (
            <List nav={nav} renderItem={renderItem} status={""} />
          )}
          {/* 待支付订单 */}

          {this.props.tab == 1 && (
            <List nav={nav} renderItem={renderItem} status={["101"]} />
          )}
          {/* 待使用订单 */}
          {this.props.tab == 2 && (
            <List
              nav={nav}
              renderItem={renderItem}
              status={[
                "102",
                "121",
                "122",
                "141",
                "142",
                "143",
                "144",
                "162",
                "161"
              ]}
            />
          )}
          {/* 已完成订单 */}
          {this.props.tab == 3 && (
            <List
              nav={nav}
              renderItem={renderItem}
              status={["105", "107", "145", "146"]}
            />
          )}
        </Tabs>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  tab: state.orderReducer.tab
});

function mapDispatchToProps(dispatch) {
  return {
    setOrderTabs: bindActionCreators(setOrderTabs, dispatch),
    setListState: bindActionCreators(setListState, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabExample);
