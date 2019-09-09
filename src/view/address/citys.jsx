import React from "react";
import Nav from "../../components/nav";
import CityPicker from "../../components/citys";
import { WhiteSpace, Button } from "antd-mobile";
import { setAddressesInfo } from "../../reducer/action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./index.scss";
import AudioButton from "../../components/button/PayConfirmButton";

let autocomplete = null;
class Citys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
  render() {
    const { address_code } = this.props.addressInfo;

    // 确认区域
    const confirmDist = () => {
      this.props.history.goBack();
    };
    const pickChange = e => {
      this.props.setAddressesInfo(Object.assign(this.props.addressInfo, e));
    };
    return (
      <div className="add_addr_wrap">
        <Nav
          title="选择地区"
          mode="audio"
          rightButton={<div onClick={() => confirmDist()}>完成</div>}
          leftButtonClick={this.props.history.goBack}
        />
        <div className="city_picker">
          <CityPicker citys_code={address_code} onChange={pickChange} />
        </div>
        <div>
          <AudioButton
            buttonType="confirm"
            content="完成"
            // config={{ width: "560px", height: "72px" }}
          />
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    addressInfo: state.userReducer.addressInfo
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setAddressesInfo: bindActionCreators(setAddressesInfo, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Citys);
