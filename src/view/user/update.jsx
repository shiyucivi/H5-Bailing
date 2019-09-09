import React from "react";
import Nav from "../../components/nav";
import NavAudio from "../../components/nav/audio_nav";

import { List, InputItem, WingBlank, Badge, Button, Toast } from "antd-mobile";
import { createForm } from "rc-form";
import API from "../../config/api/";
import "./index.scss";
import util from "../../util/JsonUtil";
import AudioButton from "../../components/button/PayConfirmButton";
import { isAndroidOrios } from "../../util/fetch";

const Icon_sel = require("../../assets/icon/audio/ic_orders_airticket_chose.png");
const Icon_normal = require("../../assets/icon/audio/ic_orders_airticket_chose_normal.png");

class UpdateUserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passengerSex: "1",
      passengerCardType: "NI",
      passengerID: "",
      DEVICE: ""
    };
  }
  componentWillMount() {
    /**
     *身份证号码
     *
     */
    window["_EDIT_ID_NUMBER"] = num => {
      this.changeKey("passengerCardType", "NI");
      this.props.form.setFieldsValue({
        passengerCardID: num
      });
    };
    /**
     *，护照号码
     *
     */
    window["_EDIT_PASSPORT_NUMBER"] = num => {
      this.changeKey("passengerCardType", "PP");

      this.props.form.setFieldsValue({
        passengerCardID: num
      });
    };
    /**
     *，手机号码
     *
     */
    window["_EDIT_CONTACT_PHONE"] = phone => {
      this.props.form.setFieldsValue({
        passengerFullName: phone
      });
    };

    /**
     *修改联系人姓名
     *
     */
    window["_EDIT_CONTACT_NAME"] = phone => {
      this.props.form.setFieldsValue({
        contact_info_name: phone
      });
    };
  }
  componentDidMount() {
    // 安卓下获取信息
    if (isAndroidOrios()[0] && window.AppBridge) {
      //维护手机 音响类别 支付方式不同
      if (window.AppBridge.getSystemModel) {
        this.setState({ DEVICE: window.AppBridge.getSystemModel() });
      }
    }
    // 修改联系人
    if (this.props.location.query && this.props.location.query.item) {
      let passengerInfo = this.props.location.query.item;
      this.setState({
        passengerSex: passengerInfo.passengerSex,
        passengerCardType: passengerInfo.passengerCardType,
        passengerID: passengerInfo.passengerID
      });
      this.props.form.setFieldsValue({
        passengerFullName: passengerInfo.passengerFullName,
        passengerMobile: passengerInfo.passengerMobile,
        // passengerBirthday: passengerInfo.passengerBirthday,
        passengerCardID: passengerInfo.passengerCardID
      });
    }
  }
  /**
   *新增用户信息
   *
   * @memberof UpdateUserPage
   */
  update = (edit = false) => {
    this.props.form.validateFields((error, value) => {
      // 计算省份证生日
      if (!error) {
        let passengerBirthday = util.IdCard(value.passengerCardID, 1);
        let _data = Object.assign(value, {
          passengerBirthday: passengerBirthday,
          passengerCardType: this.state.passengerCardType,
          passengerSex: this.state.passengerSex,
          passengerMobile: value.passengerMobile.replace(/\s+/g, "")
        });

        API.addOrEditUser(
          {
            data: {
              createID: new Date().getTime(),
              passengerInfo: _data,
              passengerID: this.state.passengerID
            }
          },
          this.state.passengerID ? true : false
        ).then(res => {
          if (res.status == 0 && res.msg == "SUCCESS") {
            Toast.info(
              `${this.state.passengerID ? "更新成功" : "新增成功"}`,
              3
            );
            this.props.history.goBack();
          } else {
            Toast.info(res.msg, 3);
          }
        });
      } else {
        const { getFieldError } = this.props.form;
        Toast.info(error[Object.keys(error)[0]].errors[0].message, 2);
      }
    });
  };
  onChange = val => {
    console.log(val);
  };
  // 修改个人信息
  editItem = item => {
    console.log(item);
  };
  handleClick = () => {
    this.inputRef.focus();
  };
  // 修改属性
  changeKey = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  render() {
    let errors;
    const { getFieldProps, getFieldError } = this.props.form;
    const isAudio = this.state.DEVICE;
    const bedge_sel = isAudio ? styles.audio_bedge_sel : styles.bedge_sel;
    const bedge = isAudio ? styles.audio_bedge : styles.bedge;

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
            leftButtonClick={this.props.history.goBack}
          />
        )}
        <div className="one_width">
          <List className="update_user ">
            <WingBlank size="lg">
              <List.Item>
                <div className="flexRinput" onClick={this.handleClick}>
                  <div className="am-input-label am-input-label-5">
                    <span>证件类型</span>
                  </div>
                  <div className="label">
                    <span>
                      <Badge
                        text={isAudio ? " " : "身份证"}
                        onClick={() =>
                          this.changeKey("passengerCardType", "NI")
                        }
                        style={
                          this.state.passengerCardType == "NI"
                            ? bedge_sel
                            : bedge
                        }
                      />
                      {isAudio && "身份证"}
                    </span>
                    <span>
                      <Badge
                        text={isAudio ? " " : "护照"}
                        onClick={() =>
                          this.changeKey("passengerCardType", "PP")
                        }
                        style={
                          this.state.passengerCardType == "NI"
                            ? bedge
                            : bedge_sel
                        }
                      />
                      {isAudio && "护照"}
                    </span>
                  </div>
                </div>
              </List.Item>
              <InputItem
                {...getFieldProps("passengerCardID", {
                  onChange() {},
                  rules: [
                    { required: true, message: "证件号码不能为空" },
                    {
                      min: 4,
                      message: "证件号码不能少于4个字符"
                    },
                    {
                      max: 20,
                      message: "证件号码不能大于20个字符"
                    }
                  ]
                })}
                clear
                placeholder="输入证件号码"
                ref={el => (this.inputRef = el)}
              >
                证件号码
              </InputItem>

              <InputItem
                {...getFieldProps("passengerFullName", {
                  rules: [
                    { required: true, message: "姓名不能为空" },
                    {
                      message: "姓名不正确",
                      pattern: /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/
                    }
                  ]
                })}
                clear
                placeholder="输入姓名"
                ref={el => (this.inputRef = el)}
              >
                姓名
              </InputItem>
              <InputItem
                {...getFieldProps("passengerMobile", {
                  rules: [
                    { required: true, message: "手机号码不能为空" },
                    {
                      message: "手机号码不正确",
                      pattern: /^1[3456789]\d{9}$/
                    }
                  ]
                })}
                type="number"
                clear
                placeholder="输入联系方式"
              >
                联系方式
              </InputItem>
              {/* <List.Item>
              <div className="flexRinput" onClick={this.handleClick}>
                <div className="am-input-label am-input-label-5">
                  <span>性别</span>
                </div>
                <div className="label">
                  <Badge
                    text="男"
                    onClick={() => this.changeKey("passengerSex", "1")}
                    style={
                      this.state.passengerSex == "1"
                        ? styles.bedge_sel
                        : styles.bedge
                    }
                  />

                  <Badge
                    text="女"
                    onClick={() => this.changeKey("passengerSex", "0")}
                    style={
                      this.state.passengerSex == "1"
                        ? styles.bedge
                        : styles.bedge_sel
                    }
                  />
                </div>
              </div>
            </List.Item> */}
            </WingBlank>
          </List>
          {isAudio ? (
            <div onClick={() => this.update()} className="user_btn_audio">
              <AudioButton buttonType="confirm" content="保存" />
            </div>
          ) : (
            <div className="user_btn">
              <Button type="primary" onClick={() => this.update()}>
                保存
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
const BasicInputExampleWrapper = createForm()(UpdateUserPage);
export default BasicInputExampleWrapper;
var styles = {
  bedge: {
    width: "70px",
    height: "25px",
    backgroundColor: "#fff",
    fontSize: "12px",
    borderRadius: 6,
    color: "#8B8B96",
    border: "1px solid #9999A3",
    marginLeft: "20px",
    lineHeight: "25px"
  },
  label: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  bedge_sel: {
    backgroundColor: "#1687FF",
    color: "#fff",
    width: "70px",
    height: "25px",
    fontSize: "12px",
    borderRadius: 6,
    border: "1px solid #9999A3",
    marginLeft: "20px",
    lineHeight: "25px"
  },
  audio_bedge_sel: {
    width: "30px",
    height: "30px",
    background: `url(${Icon_sel}) no-repeat center/contain`,
    borderRadius: "50%",
    marginRight: "10px"
  },
  audio_bedge: {
    width: "30px",
    height: "30px",
    background: `url(${Icon_normal}) no-repeat center/contain`,
    borderRadius: "50%",
    marginRight: "10px"
  }
};
