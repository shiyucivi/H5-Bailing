import React from "react";

class Stepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: this.props.min,
      max: this.props.max,
      value: this.props.value
    };
  }
  componentDidMount() {
    // if (this.props.defaultPAy) {
    //   this.change(this.props.defaultPAy);
    // }
    this.props.callback(this.state.value);
  }
  /**
   *更改step
   *
   * @memberof PayMent
   */
  change = type => {
    if (type == "add") {
      this.add();
    } else {
      this.reduce();
    }
    this.props.callback(this.state.value);
  };
  reduce = () => {
    if (this.state.value > 1) {
      this.setState({
        value: --this.state.value
      });
    }
  };
  add = () => {
    if (this.state.value >= 0 && this.state.value < this.state.max) {
      this.setState({
        value: ++this.state.value
      });
    }
  };
  render() {
    return (
      <div style={styles.flex}>
        {/* 剩余{this.state.max} */}
        <img
          onClick={() => {
            this.change();
          }}
          style={styles.icon}
          src={require("../../assets/icon/ic_orders_hotel_number_reduce@2x.png")}
        />
        {this.state.value}间
        <img
          onClick={() => {
            this.change("add");
          }}
          style={styles.icon}
          src={require("../../assets/icon/ic_orders_hotel_number_add@2x.png")}
        />
      </div>
    );
  }
}

export default Stepper;
var styles = {
  icon: { width: "18px", height: "18px", margin: "10px" },
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
