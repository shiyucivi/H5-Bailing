import React from "react";
import "./index.scss";
let lastsel = 0;

class Radio_List extends React.Component {
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
    const renderRadioList = data => (
      <ul className="radio_list_wrap">
        {data.map((i, index) => (
          <li
            key={index}
            className="radio_item"
            onClick={() => i.disable && changeSatet(i)}
          >
            <div className={i.disable ? "" : "disable_btn"}>
              {i.default ? (
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
            {this.props.renderItem(i)}
          </li>
        ))}
      </ul>
    );
    return <div>{renderRadioList(list)}</div>;
  }
}

export default Radio_List;
