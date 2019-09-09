import React from "react";
import moment from "moment";


import API from "../../config/api";
import { renderAirInfo } from "../../view/air/airFlightInfo.jsx";

import "./OrderDetailList.css";
import { thisExpression } from "@babel/types";

import PayConfirmButton from "../../components/button/PayConfirmButton.jsx"
import {order,cancelOrder} from "../../config/api/order.js"

import {Toast} from "antd-mobile"

export default class OrderDetailList extends React.Component {
  //组件包括两个props属性，第一个为orderType，表示订单类型（电影为"movie"、酒店为"hotel"或机票为"airplane"）
  //第二个为payState，值为boolean，true为支付成功，否则为支付失败
  //第三个orderCode为订单码
  constructor(props) {
    super(props);
    this.orderDetailType = props.orderType;
    this.state = {
      paySuccess: props.payState, //是否支付成功
      cancleSuccess:false,
      orderCode: props.orderCode,
      movieDetailList: {
        seat:[]
      }, //电影订单详情的数据
      hotelDetailList: {
        users: [""]
      }, //酒店订单详情的数据
      airplaneDetailList: {
        priceInfo: [],
        contact: ""
      } //机票订单详情的数据
    };
    console.log(this);
    this.confirmPay=this.confirmPay.bind(this);
  }

  //确认支付回调
  confirmPay=()=>{
    this.props.history.push(`/qrPay/${this.state.orderCode}`);
  }
  //取消订单
  cancelMovieOrder=()=>{
    cancelOrder({order_code:this.state.orderCode}).then(res=>{
      Toast.success("取消订单成功",5)
      this.setState({paySuccess:true,cancleSuccess:true});
    });
  }

  fetchOrderDetail() {
    API.getOrderDetail({ order_code: this.state.orderCode }).then(
      res => {
        if (this.orderDetailType === "movie" && res.order_code) {
          this.setState({
            movieDetailList: {
              ticketCode: res.ticket_code||"尚未支付，无取票码", //取票码
              movie: res.film_name, //电影名称
              theater: res.order_name, //影院名称
              movieInfo:
                res.hall_name +
                moment(res.begin_time).format("MM月DD日HH时mm分"), //电影场次与开始时间
              image: res.post_img, //海报图片
              seat: res.film_row_column_no.split(","), //座位
              phoneNumber: res.contact_phone, //手机号码
              price: res.total_price, //价格
              oldPrice: res.total_price //优惠前价格
            }
          });
        } else if (this.orderDetailType === "hotel" && res.order_code) {
          this.setState({
            hotelDetailList: {
              image: res.show_pic_url, //房间图片
              hotel: res.order_name, //酒店名称
              subscirbe: res.room_name + ` 共${res.room_num}间`, //预订房间和数量
              time: `${moment(res.checkin_date).format("MM月DD日")}-${moment(
                res.checkout_date
              ).format("MM月DD日")}`, //入住开始和结束时间
              users:
                res.checkin_names.indexOf("，") == -1
                  ? [res.checkin_names]
                  : res.checkin_names.split("，"), //入住人
              price: res.total_price, //总价格
              address: res.address, //酒店地址
              room: res.product_items[0].product_desc, //房间信息
              phoneNumber: `${res.contact} ${res.contact_phone}`, //联系人姓名和电话
              orderCode: res.order_code, //订单号
              orderTime: moment(res.create_time).format("YYYY年MM月DD日"), //下单时间
              tip: res.chenkin_tips //提示信息
            }
          });
        } else if (this.orderDetailType === "airplane" && res.order_code) {
          this.setState({
            airplaneDetailList: {
              airlineInfo: res, //航班信息
              passenger: `${res.product_items[0].product_name}|${
                res.product_items[0].attributes[1].value
              }`, //乘机人信息
              price: res.total_price, //总价格
              priceInfo: res.product_items.map(item => {
                return `${item.product_desc}×${
                  item.quantity
                }    共    ${item.quantity * item.unit_price}元`;
              }),
              //订单具体价格的数组
              contact: `${res.contact}  ${res.contact_phone}`, //联系人姓名和电话
              orderTime: moment(res.create_time).format("YYYY年MM月DD日"), //下单时间
              orderCode: res.order_code //订单号
            }
          });
        }

        // 订单详情返回是否可以取消、支付订单状态

        if (
          res.order_code &&
          (res.order_status_name == "待支付" ||
            res.order_status_name == "订单创建")
        ) {
          this.props.handelCallback &&
            this.props.handelCallback(res.order_status_name);
        }
      },
      () => {
        console.log("请求错误");
        thisExpression.setState({
          hotelDetailList: {
            hotel: "error"
          },
          airplaneDetailList: {
            price: "error"
          }
        });
      }
    );
  }

  //渲染电影票订单详情
  renderMovieOrderDetail() {
    return (
      <div className="order-detail-container">
        <img className="poster" src={this.state.movieDetailList.image} />
        <div
          className={`order-detail-items ${this.props.isDetailPage &&
            "nooverFlow"}`}
        >
          <p>
            <span className="detail-title">取票码：</span>
            <span className="detail-info">
              {this.state.movieDetailList.ticketCode}
            </span>
          </p>
          <p>
            <span className="detail-title">影片影院：</span>
            <span className="detail-info">
              {this.state.movieDetailList.movie}|
              {this.state.movieDetailList.theater}
            </span>
          </p>
          <p>
            <span className="detail-title">电影场次：</span>
            <span className="detail-info">
              {this.state.movieDetailList.movieInfo}
            </span>
          </p>
          <p>
            <span className="detail-title">已选座位：</span>
            <span className="detail-info">
              {this.state.movieDetailList.seat.join("|")}
            </span>
          </p>
          <p>
            <span className="detail-title">手机号码：</span>
            <span className="detail-info">
              {this.state.movieDetailList.phoneNumber}
            </span>
            <span style={{ fontSize: "24px", color: "rgba(255,255,255,0.4)" }}>
              （用于通知订单信息）
            </span>
          </p>
          <p>
            <span className="detail-title">总价：</span>
            <span className="price detail-info">
              {this.state.movieDetailList.price}
            </span>
          </p>
          {this.state.paySuccess?
            '':
            <div className="confirm-button">
              <PayConfirmButton buttonType="confirm" content="确认支付" onClick={this.confirmPay}/>
              <PayConfirmButton buttonType="confirm" content="取消订单" onClick={this.cancelMovieOrder}/>
            </div>
          }
          {this.state.cancleSuccess?<p style={{color:"white",fontSize:"36px",marginLeft:"40px",marginTop:"70px"}}>取消订单成功</p>:''}
        </div>
      </div>
    );
  }
  //渲染酒店订单详情
  renderHotelOrderDetail() {
    return (
      <div className="order-detail-container">
        <img className="poster" src={this.state.hotelDetailList.image} />
        <div
          className={`order-detail-items ${this.props.isDetailPage &&
            "nooverFlow"}`}
        >
          <p>
            <span className="detail-title">酒店名称：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.hotel}
            </span>
          </p>
          <p>
            <span className="detail-title">预订数量：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.subscirbe}
            </span>
          </p>
          <p>
            <span className="detail-title">入住时间：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.time}
            </span>
          </p>
          <p>
            <span className="detail-title" style={{ letterSpacing: "15px" }}>
              入住
            </span>
            <span className="detail-title">人：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.users.join("|")}
            </span>
          </p>
          <p>
            <span className="detail-title" style={{ letterSpacing: "15px" }}>
              总价
            </span>
            <span className="detail-title">格：</span>
            <span className="price detail-info">
              {this.state.hotelDetailList.price}
            </span>
            <span style={{ fontSize: "24px", color: "rgba(255,255,255,0.4)" }}>
              {this.state.hotelDetailList.tip}
            </span>
          </p>
          <p>
            <span className="detail-title">房间信息：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.room}
            </span>
          </p>
          <p>
            <span className="detail-title">酒店地址：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.address}
            </span>
          </p>
          <p>
            <span className="detail-title">联系方式：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.phoneNumber}
            </span>
          </p>
          <p>
            <span className="detail-title">下单时间：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.orderTime}
            </span>
          </p>
          <p>
            <span className="detail-title" style={{ letterSpacing: "15px" }}>
              订单
            </span>
            <span className="detail-title">号：</span>
            <span className="detail-info">
              {this.state.hotelDetailList.orderCode}
            </span>
          </p>
        </div>
      </div>
    );
  }
  //渲染机票订单详情
  renderAirplaneOrderDetail() {
    return (
      <div className="order-detail-container">
        <div
          className={`order-detail-items ${this.props.isDetailPage &&
            "nooverFlow"}`}
        >
          <p style={{ color: "white" }}>
            <span className="detail-title">航班信息：</span>
            {this.state.airplaneDetailList.airlineInfo &&
              renderAirInfo(this.state.airplaneDetailList.airlineInfo)}
          </p>
          <p>
            <span className="detail-title" style={{ letterSpacing: "15px" }}>
              乘机
            </span>
            <span className="detail-title">人：</span>
            <span className="detail-info">
              {this.state.airplaneDetailList.passenger}
            </span>
          </p>
          <p>
            <span className="detail-title" style={{ letterSpacing: "15px" }}>
              总价
            </span>
            <span className="detail-title">格：</span>
            <span className="detail-info price">
              {this.state.airplaneDetailList.price}
            </span>
          </p>
          <p>
            <span className="detail-title">订单总额：</span>
            <span className="detail-info">
              <table style={{ display: "inline" }}>
                <tbody>
                  {this.state.airplaneDetailList.priceInfo.map((item, i) => (
                    <tr key={i}>
                      <td>{item}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </span>
          </p>
          <p>
            <span className="detail-title" style={{ letterSpacing: "15px" }}>
              联系
            </span>
            <span className="detail-info">
              <span className="detail-title">人：</span>
              {this.state.airplaneDetailList.contact}
            </span>
          </p>
          <p>
            <span className="detail-title">下单时间：</span>
            <span className="detail-info">
              {this.state.airplaneDetailList.orderTime}
            </span>
          </p>
          <p>
            <span className="detail-title" style={{ letterSpacing: "15px" }}>
              订单
            </span>
            <span className="detail-title">号：</span>
            <span className="detail-info">
              {this.state.airplaneDetailList.orderCode}
            </span>
          </p>
        </div>
      </div>
    );
  }
  render() {
    switch (this.orderDetailType) {
      case "movie":
        return this.renderMovieOrderDetail();
      case "hotel":
        return this.renderHotelOrderDetail();
      case "airplane":
        return this.renderAirplaneOrderDetail();
    }
  }
  componentWillMount() {
    this.fetchOrderDetail();
  }
}
