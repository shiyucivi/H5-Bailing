import React from "react";
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: this.props.time,
      show: false,
      config: {
        color: "#1687FF",
        icon: true
      }
    };
  }
  count = int => {
    var maxtime = int * 60; //
    var minutes, seconds, msg;
    var that = this;
    //单纯分钟和秒倒计时
    function CountDown() {
      if (maxtime >= 0) {
        minutes = Math.floor(maxtime / 60);
        seconds = Math.floor(maxtime % 60);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        msg = minutes + ":" + seconds;
        console.log("====================================");
        console.log(msg);
        console.log("====================================");
        that.setState({
          time: msg
        });
        --maxtime;
      } else {
        that.props.callBack();
        clearInterval(that.timer);
      }
    }
    this.timer = setInterval(CountDown, 1000);
  };
  componentWillUnmount = () => {
    clearInterval(this.timer);
    clearTimeout(this.showout);
  };

  componentDidMount() {
    const { config } = this.props;
    if (config) {
      this.setState({
        config: config
      });
    }
    clearInterval(this.timer);
    this.count(this.props.time);
    this.showout = setTimeout(() => {
      this.setState({
        show: true
      });
    }, 1000);
  }
  render() {
    const { config } = this.state;
    return (
      <div>
        {this.state.show && (
          <div style={Object.assign({}, styles.time, config)}>
            {config.icon && (
              <img
                style={{
                  width: "15px",
                  height: "15px",
                  marginRight: "10px"
                }}
                src={require("../../assets/icon/ic_orderpay_time@2x.png")}
              />
            )}

            {this.state.time}
          </div>
        )}
      </div>
    );
  }
}
var styles = {
  time: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: "10px",
    marginLeft: "5px"
  }
};
