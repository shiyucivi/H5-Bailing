import React from "react";
// import "./index.scss";
import Nav from "../../components/nav";
import API from "../../config/api";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: {
                address: "",
                comment: "",
                commodity_category: 2,
                contact: "",
                contact_phone: "",
                create_time: "",
                delivery_man_contact: "",
                delivery_man_name: "",
                delivery_type: 1,
                delivery_type_name: "",
                exp_fee: -1,
                free_exp_fee_threshold: 0,
                limited_items: [],
                merchant_contact: "",
                order_code: "",
                order_delivery_time: "",
                order_name: "",
                order_status: -1,
                order_status_list: null,
                order_status_name: "",
                original_total_price: -1,
                packing_fee: 1,
                predict_delivery_time: null,
                predict_delivery_time_hhmm: "",
                product_items: [],
                promotion_items: [],
                timeout: "",
                timeout_seconds: 0,
                total_price: -1,
                unavailable_items: []
            }
        };
    }

    componentDidMount() {
        this.fetchOrderDetail();
    }

    fetchOrderDetail = (params = {order_code: this.props.match.params.id}) => {
        API.getOrderDetail(params).then(res => {
            this.setState({
                detail: res
            });
        });
    };

    render() {
        return (
            <div className="zoom_audio" style={{padding: "0 50px"}}>
                <Nav
                    mode={"audio"}
                    leftButtonClick={this.props.history.goBack}
                    title={"订单详情"}
                />
                <div
                    className={"confirm-wrap"}>
                    <div
                        className={"confirm-wrap-div"}
                    >
                        <span style={{whiteSpace: "nowrap"}}>收货信息：</span>
                        <div style={{color: "#fff"}}>
                            {this.state.detail.address}
                            <div
                                style={{
                                    lineHeight: "70px",
                                    color: "rgba(255,255,255,0.6)"
                                }}
                            >
                                {this.state.detail.contact}{" "}
                                <span>{this.state.detail.contact_phone}</span>
                            </div>
                        </div>
                    </div>
                    <div
                        className={"confirm-wrap-div"}
                        style={{
                            marginTop: "30px",
                        }}
                    >
                        <span style={{whiteSpace: "nowrap"}}>商品信息：</span>
                        <div className="comments_wrap" style={{paddingLeft: "0", height: "fit-content"}}>
                            <ul style={{listStyle: "none", marginTop: "-0px"}}>
                                {this.state.detail.product_items.map((item, index) => (
                                    <li key={index} style={{marginLeft: "-40px"}}>
                                        <span
                                            style={{
                                                display: "flex",
                                                paddingRight: "28px"
                                            }}
                                        >
                                          <span style={{width: "480px"}}>
                                            {item.product_name}
                                              <div className="foodList-content">
                                              {" "}
                                                  {item.attri}{" "}
                                            </div>
                                          </span>
                                          <span
                                              className="foodList-item-1">
                                            ￥{item.unit_price}
                                          </span>
                                          <span
                                              className={"foodList-item-2"}>
                                            X{item.quantity}
                                          </span>
                                        </span>
                                        <div className="split"/>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "inline-flex",
                            flexDirection: "column",
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "30px"
                        }}
                    >
                        {/*<span style={{whiteSpace: "nowrap", lineHeight: "80px"}}>总价：*/}
                        {/*     <span className="price"*/}
                        {/*           style={{color: "#F5AB00FF"}}>￥{this.props.location.query ? this.props.location.query.price : ""}</span>*/}
                        {/*    <span*/}
                        {/*        className="delivery_price">(配送费￥{this.props.location.query ? this.props.location.query.deliveryFee : ""})</span>*/}
                        {/*</span>*/}
                        <span className="confirm-text">
              配送日期：
              <span style={{color: "#fff"}}>
                {this.state.detail.order_delivery_time === ""
                    ? "立即送"
                    : this.state.detail.order_delivery_time.substring(0, 10)}
              </span>
            </span>
                        <span className="confirm-text">
              配送时间：
              <span style={{color: "#fff"}}>
                {this.state.detail.predict_delivery_time_hhmm}
              </span>
            </span>
                        <span className="confirm-text">
              商家留言：
              <span style={{color: "#fff"}}>{this.state.detail.comment}</span>
            </span>
                        <span className="confirm-text">
              下单时间：
              <span style={{color: "#fff"}}>
                {this.state.detail.create_time}
              </span>
            </span>{" "}
                        <span className="confirm-text">
              订单号：
              <span style={{color: "#fff"}}>
                {this.state.detail.order_code}
              </span>
            </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Detail;
