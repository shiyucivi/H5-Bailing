import React from "react";
// import "./index.scss";
import Nav from "../../components/nav";
import { createForm } from "rc-form";
import { setFoodList } from "../../reducer/action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class FoodsList extends React.Component {
  constructor(props) {
    super(props);
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
      pageIndex: 1,
      page_size: 10
    };
  }

  componentDidMount() {}

  render() {
    const { foodList } = this.props;
    return (
      <div className="comments_wrap zoom_audio">
        <Nav
          mode={"audio"}
          leftButtonClick={this.props.history.goBack}
          title={"已选商品"}
        />
        <ul
          style={{
            listStyle: "none",
            margin: "0px",
            height: "451px",
            overflow: "scroll"
          }}
        >
          {foodList &&
            foodList.map((item, index) => (
              <li key={index} style={{ marginLeft: "-40px" }}>
                <span style={{ display: "flex", paddingRight: "28px" }}>
                  <span style={{ width: "480px" }}>
                    {item.product_name}
                    <div
                      style={{
                        marginTop: "10px",
                        opacity: "0.3",
                        fontSize: "28px",
                        lineHeight: "45px"
                      }}
                    >
                      {" "}
                      {item.attri}{" "}
                    </div>
                  </span>
                  <span
                    style={{
                      lineHeight: "99px",
                      marginLeft: "auto"
                    }}
                  >
                    ￥{item.unit_price}
                  </span>
                  <span
                    style={{
                      lineHeight: "99px",
                      marginLeft: "259px"
                    }}
                  >
                    X{item.quantity}
                  </span>
                </span>
                <div className="split" />
              </li>
            ))}
        </ul>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            paddingBottom: "99px",
            width: "100%"
          }}
        >
          共四件商品
          <span style={{ float: "right", paddingRight: "162px" }}>
            <span className="price">总价：</span>
            <span className="price" style={{ color: "#F5AB00FF" }}>
              ￥92
            </span>
            <span className="delivery_price">(配送费￥3)</span>
          </span>
        </div>
      </div>
    );
  }
}

// export default Takeout;

const mapStateToProps = state => ({
  foodList: state.orderReducer.foodList
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
)(createForm()(FoodsList));
