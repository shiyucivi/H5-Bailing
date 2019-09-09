import React from "react";
import "./index.scss";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }
  componentDidMount() {
    this.setState({
      list: this.props.list
    });
  }
  render() {
    const { list } = this.state;
    const changeSatet = item => {
      if (item.default) {
      } else {
        list.map(k => {
          k.default = false;
        });
        item.default = true;
        this.setState({
          list: list
        });
        this.props.callBackHandel && this.props.callBackHandel(item);
      }
    };
    return (
      <div className="radio_wrap">
        {list.map((item, index) => (
          <div key={index} className="radio_wrap_item">
            <div onClick={() => changeSatet(item)}>
              {item.default ? (
                <img
                  className="icon"
                  src={require("../../assets/icon/audio/ic_orders_airticket_chose.png")}
                />
              ) : (
                <img
                  className="icon"
                  src={require("../../assets/icon/audio/ic_orders_airticket_chose_normal.png")}
                />
              )}
            </div>

            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }
}
