import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setPansengers } from "../../reducer/action";
import Nav from "../../components/nav";
import NavAudio from "../../components/nav/audio_nav";
import "./index.scss";
import { List, Checkbox, Button, WingBlank, Toast } from "antd-mobile";
import API from "../../config/api/";
import AudioButton from "../../components/button/PayConfirmButton";
import { isAndroidOrios } from "../../util/fetch";

let DEVICE = "";

// addUserOage
const CheckboxItem = Checkbox.CheckboxItem;
class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passengerList: []
    };
  }
  componentDidMount() {
    // 安卓下获取信息
    if (isAndroidOrios()[0] && window.AppBridge) {
      //维护手机 音响类别 支付方式不同
      if (window.AppBridge.getSystemModel) {
        DEVICE = window.AppBridge.getSystemModel();
      }
    }
    API.getUserList().then(res => {
      if (res.status == 0 && res.msg == "SUCCESS") {
        if (res.data && res.data !== []) {
          // 回填选项
          let _list = this.props.pansengers;

          _list &&
            res.data.map(item => {
              _list.forEach(element => {
                if (item.passengerCardID == element.passengerCardID) {
                  item.sel = element.sel;
                }
              });
            });
          this.setState({
            passengerList: res.data
          });
        }
      } else {
        Toast.info(res.msg, 3);
      }
    });
  }
  onChange = val => {
    val.sel = !val.sel;
    // console.log(val);
  };
  // 修改个人信息
  editItem = item => {
    this.props.history.push({
      pathname: "/update",
      query: { item: item }
    });
  };
  //保存已选跳转
  update = () => {
    let _sel_list = this.state.passengerList.filter(item => {
      return item.sel == true;
    });
    _sel_list.map(item => (item.passenger_id = item.passengerID));
    if (_sel_list.length == 0) {
      Toast.info("请选择至少一个乘机人", 3);
      return;
    }
    // util.setLocalStorage("passengers", _sel_list);
    this.props.setPansengers(_sel_list);
    this.props.history.goBack();
  };
  render() {
    const data = this.state.passengerList;
    const isAudio = DEVICE;
    const renderCheckBox = data => (
      <List className="user_list">
        {data.map(i => (
          <CheckboxItem
            key={i.createId}
            defaultChecked={i.sel}
            onChange={() => this.onChange(i)}
          >
            <div className="flexR">
              <div>
                <p>
                  <span className="edit_l">
                    {i.passengerFullName}
                    {i.passengerMobile}
                  </span>
                </p>
                <p className="flex">
                  <img
                    className="pen_icon"
                    src={require("../../assets/icon/ic_orders_airticket_idcard@2x.png")}
                  />
                  <span>{i.passengerCardID}</span>
                </p>
              </div>
              <img
                className="edit_icon"
                onClick={() => this.editItem(i)}
                src={require("../../assets/icon/ic_orders_airticket_edit@2x.png")}
              />
            </div>
          </CheckboxItem>
        ))}
      </List>
    );
    return (
      <div className="wrap">
        {isAudio ? (
          <NavAudio
            title="用户信息"
            leftButton
            leftButtonClick={this.props.history.goBack}
          />
        ) : (
          <Nav
            title="用户信息"
            leftButton
            rightButton
            leftButtonClick={this.props.history.goBack}
            rightButtonClick={() => {
              this.props.history.push({
                pathname: "/update"
              });
            }}
          />
        )}

        <div className="one_width">
          {/* audio下添加信息btn */}
          {isAudio && (
            <div
              className="add_btn"
              onClick={() => {
                this.props.history.push({
                  pathname: "/update"
                });
              }}
            >
              + 新建
            </div>
          )}
          {renderCheckBox(data)}
          {isAudio ? (
            <div onClick={() => this.update()} className="user_btn_audio">
              <AudioButton buttonType="confirm" content="完成" />
            </div>
          ) : (
            <div className="user_btn">
              <Button type="primary" onClick={() => this.update()}>
                完成
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    pansengers: state.userReducer.pansengers
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setPansengers: bindActionCreators(setPansengers, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage);
