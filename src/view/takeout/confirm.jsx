import React from "react";
import {ListView} from "antd-mobile";
import Nav from "../../components/nav";
import ConfirmButton from "../../components/button/PayConfirmButton";
import {setFoodList} from "../../reducer/action";
import {connect} from "react-redux";
import {createForm} from "rc-form";
import {bindActionCreators} from "redux";
import Timeout from "../../components/timeout/index.jsx";
// import "./index.scss";

class ConfirmTakeout extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        this.state = {
            comments_show: false,
            foodList: [
                {
                    product_desc: "",
                    stock_id: "",
                    promotion_name: "",
                    unit_price: 34,
                    promotion_price: 0,
                    quantity: 2,
                    attributes: [],
                    product_id: "",
                    product_name: ""
                }
            ],
            dataArr: [],
            dataSource: dataSource.cloneWithRows({}),
            pageIndex: 1,
            page_size: 10,
            timeoutNum: 15
        };
    }

    componentDidMount() {
        let dataArr = [];
        let data = this.props.foodList;
        for (let i = 0; i < data.length; i++) {
            let attr = "";
            let isNotFirst = false;
            for (let j = 0; j < data[i].attributes.length; j++) {
                if (isNotFirst) {
                    attr += " | ";
                }
                isNotFirst = true;
                attr += data[i].attributes[j].value;
            }
            //每一次读取的数据都进行保存一次
            data[i].attri = attr;
            // dataArr.push(`row - ${this.state.pageIndex * data.length + i}`);
        }
        this.setState(
            {
                foodList: data,
                dataSource: this.state.dataSource.cloneWithRows(dataArr),
                isLoading: false,
                dataArr: dataArr
            },
            () => {
            }
        );
    }

    timeoutCallback = () => {
    };
    pay = () => {
        this.props.history.push(`/qrPay/${this.props.orderInfo.order_code}`);
    };

    render() {
        const {orderInfo} = this.props;
        return (
            <div className="zoom_audio" style={{padding: "0 50px"}}>
                <Nav
                    mode={"audio"}
                    leftButtonClick={this.props.history.goBack}
                    title={"已选商品"}
                    rightButton={
                        <Timeout
                            time={this.state.timeoutNum}
                            callBack={this.timeoutCallback}
                        />
                    }
                />
                <div className="confirm-wrap">
                    <div className="confirm-wrap-div">
                        <span style={{whiteSpace: "nowrap"}}>收货信息：</span>
                        <div style={{color: "#fff"}}>
                            {orderInfo.address}
                            <div
                                style={{
                                    lineHeight: "70px",
                                    color: "rgba(255,255,255,0.6)"
                                }}
                            >
                                {orderInfo.contact} <span> {orderInfo.contact_phone}</span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="confirm-wrap-div"
                        style={{
                            marginTop: "30px",
                        }}>
                        <span style={{whiteSpace: "nowrap"}}>商品信息：</span>
                        <div
                            className="comments_wrap"
                            style={{paddingLeft: "0", height: "fit-content"}}
                        >
                            <ul style={{listStyle: "none", marginTop: "-0px"}}>
                                {this.props.foodList.map((item, index) => (
                                    <li key={index} style={{marginLeft: "-40px"}}>
                                         <span style={{display: "flex", paddingRight: "28px"}}>
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
                        <span className="confirm-text">
              总价：
              <span className="price" style={{color: "#F5AB00FF"}}>
                ￥{orderInfo.total_price ? orderInfo.total_price : ""}
              </span>
              <span className="delivery_price">
                (配送费￥
                  {orderInfo.exp_fee ? orderInfo.exp_fee : "0"})
              </span>
            </span>
                        <span className="confirm-text">
              配送日期：
              <span style={{color: "#fff"}}>
                {orderInfo.timeout ? orderInfo.timeout : ""}
              </span>
            </span>
                        <span className="confirm-text">
              配送时间：
              <span style={{color: "#fff"}}>
                {orderInfo.delivery_time == ""
                    ? orderInfo.delivery_time
                    : "尽快送达"}
              </span>
            </span>
                        <span className="confirm-text">
              商家留言：
              <span style={{color: "#fff"}}>
                {orderInfo.comment ? orderInfo.comment : ""}
              </span>
            </span>
                    </div>
                </div>
                <div
                    onClick={() => this.pay()}
                    style={{width: "560px", margin: "63px auto"}}
                >
                    <ConfirmButton content="确认支付" buttonType="confirm"/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    foodList: state.orderReducer.foodList,
    orderInfo: state.orderReducer.takeoutOrderInfo
    // contactInfo: state.contactInfo
});

function mapDispatchToProps(dispatch) {
    return {
        setFoodList: bindActionCreators(setFoodList, dispatch)
        // setContactInfo: bindActionCreators(contactInfo, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(createForm()(ConfirmTakeout));
