import React from "react";
import "./index.scss";
import Nav from "../../components/nav";
import ConfirmButton from "../../components/button/PayConfirmButton";
import {exit} from "../../util/fetch";

import {setFoodList, setTakeoutOrderInfo} from "../../reducer/action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {createForm} from "rc-form";
import API from "../../config/api/";

class Takeout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments_show: false,
            addressInfo: {
                contact: "",
                address: "",
                contact_phone: ""
            }
        };
    }

    /**
     *下单
     *
     * @memberof AirDetailPage
     */
    fetchOrderDetail = (params = {cart_id: this.props.match.params.id}) => {
        API.cartCommodityAttributes(params).then(res => {
            if (res.status == 0) {
                let data = res.data.product_items;
                this.props.setFoodList(data);
                this.setState({
                    addressInfo: {
                        contact: res.data.contact,
                        address: res.data.address,
                        contact_phone: res.data.contact_phone
                    }
                });
                this.props.setTakeoutOrderInfo(res.data);
            } else {
                alert(res.message);
            }
        });
    };

    componentWillMount() {
        /**
         *下一步、下单、锁座”
         *
         */
        window["_NEXT"] = () => {
            this.order();
        };
    }

    componentDidMount() {
        // 获取参数 判断是否为下单页面
        const cart_id = this.props.match.params.id;
        const {current_address} = this.props;
        const {orderInfo} = this.props;

        if (cart_id && !orderInfo.contact_phone) {
            // 无订单信息
            this.fetchOrderDetail();
        }
        if (current_address && Object.keys(current_address).length !== 0) {
            this.update_address();
        }
    }

    update_address = () => {
        const {current_address} = this.props;
        const {orderInfo} = this.props;
        // 地址被修改更新购物车
        let obj = {
            extra_lvl1: orderInfo.extra_lvl1,
            extra_lvl2: orderInfo.extra_lvl2,
            contact: current_address.consignee,
            contact_phone: current_address.consigneeMobile,
            comment: orderInfo.comment,
            address: current_address.addressRegion,
            address_longitude: current_address.longitude,
            address_latitude: current_address.latitude,
            cart_id: orderInfo.cart_id,
            merchant_id: orderInfo.merchant_id,
            delivery_time: "",
            commodities: orderInfo.product_items || orderInfo.commodities
        };
        this.props.setTakeoutOrderInfo(obj);
    };
    update_cart = () => {
        return new Promise((resolve, reject) => {
            const {current_address} = this.props;
            const {orderInfo} = this.props;
            // 地址被修改更新购物车
            let obj = {
                extra_lvl1: orderInfo.extra_lvl1,
                extra_lvl2: orderInfo.extra_lvl2,
                contact: orderInfo.contact,
                contact_phone: orderInfo.contact_phone,
                comment: orderInfo.comment,
                address: orderInfo.address,
                address_longitude: orderInfo.address_longitude,
                address_latitude: orderInfo.address_latitude,
                cart_id: orderInfo.cart_id,
                merchant_id: orderInfo.merchant_id,
                delivery_time: "",
                commodities: orderInfo.product_items || orderInfo.commodities
            };
            console.log("====================================");
            console.log(obj, orderInfo);
            console.log("====================================");
            API.cart(obj).then(res => {
                if (res.status == 0) {
                    let data = res.data.product_items;
                    this.props.setFoodList(data);
                    this.setState({
                        addressInfo: {
                            contact: res.data.contact,
                            address: res.data.address,
                            contact_phone: res.data.contact_phone
                        }
                    });
                    this.props.setTakeoutOrderInfo(res.data);
                    resolve();
                } else {
                    alert(res.message);
                    reject();
                }
            });
        });
    };
    //跳转
    update = () => {
    };
    order = () => {
        const {orderInfo} = this.props;
        this.update_cart().then(() => {
            API.orderByCart({
                cart_id: orderInfo.cart_id
            }).then(res => {
                if (res.status === 0) {
                    this.props.setTakeoutOrderInfo(res.data);

                    this.props.history.push({
                        pathname: "/order/takeout/confirm",
                        query: {
                            date: `${orderInfo.timeout}`,
                            time: "尽快送",
                            comments: orderInfo.comment ? orderInfo.comment : "",
                            price: `${orderInfo.total_price}`,
                            deliveryFee: `${orderInfo.exp_fee}`
                        }
                    });
                } else {
                    alert(res.msg);
                }
            });
        });
    };

    render() {
        const {foodList, orderInfo} = this.props;
        const routeParams = JSON.stringify({
            shop: {
                extra_lvl1: orderInfo.extra_lvl1,
                extra_lvl2: orderInfo.extra_lvl2,
                merchant_id: orderInfo.merchant_id,
                merchant_longitude: orderInfo.merchant_longitude,
                merchant_latitude: orderInfo.merchant_latitude
            },
            from: "h5"
        });

        return (
            <div className="address_list_wrap zoom_audio" style={{padding: "0 50px"}}>
                <Nav
                    mode={"audio"}
                    leftButtonClick={() => {
                        exit();
                    }}
                    title={"已选商品"}
                />
                <div className="page">
                    <div className="index_wrap">
                        <div className="index_list_wrap">
                            <ul className={"index-ul"}>
                                {foodList.map((item, index) => (
                                    <li key={index} style={{marginLeft: "-40px"}}>
                                        <span style={{display: "flex", paddingRight: "28px"}}>
                                          <span style={{width: "480px"}}>
                                            {item.product_name}
                                              <div className={"foodList-content"}>
                                              {" "}
                                                  {item.attri}{" "}
                                            </div>
                                          </span>
                                          <span
                                              className="foodList-item-1">
                                            ￥{item.unit_price}
                                          </span>
                                          <span
                                              className="foodList-item-3">
                                            X{item.quantity}
                                          </span>
                                        </span>
                                        <div className="split"/>
                                    </li>
                                ))}
                            </ul>
                            <div
                                onClick={() => {
                                    this.update();
                                    this.props.history.push("/order/takeout/foods");
                                }}
                                className={"show-more"}>
                                <span>查看更多</span>
                                <img
                                    style={{marginLeft: "10px"}}
                                    src={require("../../assets/icon/ic_takeout_ordersure_arrow_down.png")}
                                />
                            </div>
                        </div>
                        <div className={"index-column-2"}>
                            <div
                                onClick={() => {
                                    this.props.history.push(`/address/list?from=${routeParams}`);
                                }}
                                style={{display: "flex"}}
                            >
                                <span>
                                    <div
                                        className={"address-wrap"}
                                    >{orderInfo.address}
                                    </div>
                                    <div
                                        style={{
                                            lineHeight: "70px",
                                            color: "rgba(255,255,255,0.6)"
                                        }}
                                    >{orderInfo.contact} <span>{orderInfo.contact_phone}</span>
                                    </div>
                                </span>
                                <img
                                    style={{
                                        marginLeft: "10px",
                                        width: "40px",
                                        height: "40px",
                                        margin: "auto"
                                    }}
                                    src={require("../../assets/icon/ic_takeout_ordersure_arrow_right.png")}
                                />
                            </div>
                            <div className={"index-text"}>
                                配送日期{" "}
                                <span style={{marginLeft: "35px"}}>
                                {" "}
                                    {orderInfo.timeout && orderInfo.timeout.slice(0, 10)}
                                </span>
                            </div>
                            <div className={"index-text"}>
                                配送时间{" "}
                                <span style={{marginLeft: "35px"}}>
                                {" "}
                                    {orderInfo.delivery_time == ""
                                        ? "尽快送达"
                                        : orderInfo.delivery_time}
                                </span>
                            </div>
                            <div
                                style={{
                                    marginTop: "20px",
                                    overflow: "auto",
                                    maxHeight: "100px"
                                }}
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: "/order/takeout/comments",
                                        query: {
                                            comments: this.props.location.query
                                                ? this.props.location.query.comments
                                                : "说出您的留言"
                                        }
                                    });
                                }}>
                                商家留言
                                <span
                                    style={{
                                        color: "rgba(255,255,255,0.3)",
                                        marginLeft: "35px"
                                    }}
                                >
                                    {orderInfo.comment ? orderInfo.comment : "填写商家留言"}
                                </span>
                            </div>
                            <div style={{marginTop: "40px"}}>
                                <span className="price">总价：</span>
                                <span className="price" style={{color: "#F5AB00FF"}}>
                                    ￥{orderInfo.total_price}
                                </span>
                                <span className="delivery_price">
                                    (配送费￥{orderInfo.exp_fee})
                                </span>
                            </div>
                            <div
                                style={{marginTop: "20px"}}
                                onClick={() => {
                                    this.order();
                                }}>
                                <ConfirmButton content="确认" buttonType="confirm"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// export default Takeout;

const mapStateToProps = state => ({
    foodList: state.orderReducer.foodList,
    current_address: state.userReducer.current_address,
    orderInfo: state.orderReducer.takeoutOrderInfo
});

function mapDispatchToProps(dispatch) {
    return {
        setFoodList: bindActionCreators(setFoodList, dispatch),
        setTakeoutOrderInfo: bindActionCreators(setTakeoutOrderInfo, dispatch)
        // setContactInfo: bindActionCreators(contactInfo, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(createForm()(Takeout));
