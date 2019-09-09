import React from "react";

class PayMent extends React.Component {
  state = {
    type: "wx"
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.defaultPAy) {
      this.change(this.props.defaultPAy);
    }
  }
  /**
   *更改默认支付方式
   *
   * @memberof PayMent
   */
  change = type => {
    this.setState({
      type: type
    });
    this.props.changeType(type);
  };
  render() {
    return (
      <div>
        <p onClick={() => this.change("ali")} style={styles.flexR}>
          <span style={styles.flex}>
            <img
              style={styles.icon}
              src={require("../../assets/icon/ic_orders_airticket_pay@2x.png")}
            />{" "}
            支付宝
          </span>
          {/* wx */}
          {this.state.type !== "wx" && (
            <img
              style={styles.icon}
              src={require("../../assets/icon/ic_orders_airticket_chose@2x.png")}
            />
          )}
          {/* ali */}
          {this.state.type == "wx" && (
            <img
              style={styles.icon}
              src={require("../../assets/icon/ic_orders_airticket_chose_normal@2x.png")}
            />
          )}
        </p>
        <p onClick={() => this.change("wx")} style={styles.flexR}>
          <span style={styles.flex}>
            <img
              style={styles.icon}
              src={require("../../assets/icon/ic_orders_airticket_pay_wechat@2x.png")}
            />{" "}
            微信
          </span>
          {/* wx */}
          {this.state.type == "wx" && (
            <img
              style={styles.icon}
              src={require("../../assets/icon/ic_orders_airticket_chose@2x.png")}
            />
          )}
          {/* ali */}
          {this.state.type !== "wx" && (
            <img
              style={styles.icon}
              src={require("../../assets/icon/ic_orders_airticket_chose_normal@2x.png")}
            />
          )}
        </p>
      </div>
    );
  }
}

export default PayMent;
var styles = {
  icon: { width: "20px", height: "20px", marginRight: "10px" },
  flexR: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
};
