import React from "react";
import { Toast } from "antd-mobile";

import Nav from "../../components/nav/audio_nav.js";
import { editMovieUser } from "../../config/api/user.js";
import API from "../../config/api";
import "./PayConfirm.css";
import { log } from "util";

export default class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderCode: this.props.match.params.id,
      movie: "蜘蛛侠", //电影名称
      theater: "影院", //影院名称
      movieInfo: "", //电影场次
      image: "", //电影海报
      seat: [], //已选座位
      phoneNumber: "", //联系人手机号
      price: "255", //付款价格
      oldPrice: "255", //优惠前价格
      isChangingPhone: false
    };
    this.postOrder = this.postOrder.bind(this);
    this.getOrderDetail = this.getOrderDetail.bind(this);
    this.changePhoneNumber = this.changePhoneNumber.bind(this);
    this.finishChangePhoneNumber = this.finishChangePhoneNumber.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }
  //获取订单的各种信息
  getOrderDetail() {
    API.getOrderDetail({ order_code: this.props.match.params.id }).then(res => {
      //座位信息重新排列
      if (res.order_code) {
        this.setState({
          movie: res.film_name,
          theater: res.order_name,
          movieInfo: res.hall_name,
          image: res.post_img,
          seat: res.film_row_column_no.split(","),
          phoneNumber: res.contact_phone,
          price: res.total_price,
          oldPrice: res.total_price,
          isChangingPhone: false
        });
      }
    });
  }
  /*点击修改联系人手机号按钮回调 */
  changePhoneNumber() {
    this.setState({
      isChangingPhone: true
    });
    document.querySelector("input").focus();
  }
  /*点击完成修改联系人手机号按钮回调 */
  finishChangePhoneNumber() {
    let reg = /^1[3456789]\d{9}$/;
    if (reg.test(this.state.phoneNumber)) {
      this.setState({
        isChangingPhone: false
      });
    } else {
      Toast.info("请输入正确的手机号码", 3);
      document.querySelector("input").focus();
    }
    editMovieUser({
      order_code: this.state.orderCode.toString(),
      inform_phone: this.state.phoneNumber.toString()
    });
  }
  /*发送确认订单表单 */
  postOrder() {
    this.history.push(`/qrPay/${this.props.match.params.id}`);
  }
  /*手机号输入框输入事件回调 */
  inputChange(e) {
    this.setState({
      phoneNumber: e.target.value
    });
  }
  componentWillMount() {
    this.getOrderDetail();

    /**
     *下一步、下单、锁座”
     *
     */
    window["_NEXT"] = () => {
      this.postOrder();
    };
    /**
     *修改手机号
     *
     */
    window["_EDIT_CONTACT_PHONE"] = phone => {
      this.setState({
        phoneNumber: phone
      });
    };
  }

  render() {
    const _seat = this.state.seat
      .join()
      .split(";")
      .map(item => `${item[0]} 排${item[2]} 座`)
      .reverse();
    const seat = _seat.map((item, index) => <span key={index}>{item};</span>);

    return (
      <div className="pay-confirm">
        <Nav
          title={"确认支付"}
          leftButton
          leftButtonClick={() => {
            if (this.state.isOrder) {
              console.log("exit");
            } else {
              return this.props.history.goBack();
            }
          }}
        />
        <div className="box">
          <div className="main">
            <img src={this.state.image} />
            <div className="order-info">
              <p>
                影片影院：
                <span>
                  {this.state.movie}|{this.state.theater}
                </span>
              </p>
              <p>
                电影场次：<span>{this.state.movieInfo}</span>
              </p>
              <p>
                已选座位：<span>{seat}</span>
              </p>
              <p>
                手机号码：
                {this.state.isChangingPhone ? (
                  <span>
                    <span className="phone-number">
                      <input
                        type="text"
                        maxLength={11}
                        value={this.state.phoneNumber}
                        onChange={this.inputChange}
                      />
                    </span>
                    <span
                      className="change-btn"
                      tabIndex={0}
                      onClick={this.finishChangePhoneNumber}
                    >
                      完成
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="phone-number">
                      {this.state.phoneNumber}
                    </span>
                    <span
                      className="change-btn"
                      tabIndex={0}
                      onClick={this.changePhoneNumber}
                    >
                      修改
                    </span>
                  </span>
                )}
              </p>
              <p>
                <span>总</span>价：<span>{this.state.price}</span>
                <span>
                  {(this.state.price !== this.state.oldPrice) &
                    this.state.oldPrice}
                </span>
              </p>
            </div>
          </div>
          <div className="confirm-button">
            <input type="button" value="确认支付" onClick={this.postOrder} />
          </div>
        </div>
      </div>
    );
  }
}
