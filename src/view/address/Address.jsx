import React from "react";
import Nav from "../../components/nav";
import { WhiteSpace, Toast } from "antd-mobile";
import { connect } from "react-redux";
import { setAddressesInfo } from "../../reducer/action";
import { bindActionCreators } from "redux";
import Input from "../../components/input";
import Radio from "../../components/radio/";
import AudioButton from "../../components/button/PayConfirmButton";
import API from "../../config/api/index";
class UpdateAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alias: [
        { label: "家", value: "家", default: true },
        { label: "学校", value: "学校" },
        { label: "公司", value: "公司" }
      ]
    };
  }
  componentWillMount() {
    const { query } = this.props.location;
    if (query && query.item) {
      const item = query.item;
      let _temp = {
        consignee: item.consignee,
        consigneeMobile: item.consigneeMobile,
        addressProvince: item.addressProvince,
        addressCity: item.addressCity,
        addressDistrict: item.addressDistrict,
        addressRegion: item.addressRegion,
        addressDetail: item.addressDetail,
        createId: item.createId,
        latitude: item.latitude,
        longitude: item.longitude,
        addressID: item.addressId,
        addressType: item.addressType,
        addressAlias: item.addressAlias
      };
      // 回填别名
      if (item.addressAlias) {
        let arr = this.state.alias.map(j => {
          if (j.value == item.addressAlias) {
            j.default = true;
          } else {
            j.default = false;
          }
          return j;
        });
        console.log("====================================");
        console.log(arr);
        console.log("====================================");
        this.setState({
          alias: arr
        });
      }
      this.props.setAddressesInfo(
        Object.assign({}, this.props.addressInfo, _temp)
      );
    }
  }
  setAttrInfo = e => {
    const { value, name } = e;
    let _temp = {};
    _temp[name] = value;
    this.props.setAddressesInfo(
      Object.assign({}, this.props.addressInfo, _temp)
    );
  };
  deleteAll = e => {
    const { name } = e;
    let _temp = {};
    _temp[name] = "";
    this.props.setAddressesInfo(
      Object.assign({}, this.props.addressInfo, _temp)
    );
  };

  addOrUpdateAddress = params => {
    console.log("====================================");
    console.log(params);
    console.log("====================================");
    if (!params.consignee) {
      Toast.info("姓名不能为空", 2);
      return false;
    }
    if (
      !params.consigneeMobile ||
      !/^1[3456789]\d{9}$/.test(params.consigneeMobile)
    ) {
      Toast.info("手机号码不正确", 2);
      return false;
    }
    if (!params.addressProvince) {
      Toast.info("地址不能为空", 2);
      return false;
    }
    params.addressType = 0;
    let obj = {
      address: params,
      addressID: params.addressID ? params.addressID : "0",
      createID: Date.now()
    };

    API.addOrEditAddress({ data: obj }, !params.addressID).then(res => {
      if (res.status == 0) {
        Toast.info("更新成功", 2);
        this.props.history.goBack();
      } else {
        Toast.info(res.msg, 2);
      }
    });
  };
  render() {
    const { addressInfo } = this.props;
    const { alias } = this.state;
    return (
      <div className="add_addr_wrap zoom_audio">
        <Nav
          title="添加新地址"
          mode="audio"
          leftButton={1}
          leftButtonClick={this.props.history.goBack}
        />
        <div className="input_group">
          <Input
            name="consignee"
            value={addressInfo.consignee}
            handleChange={e => {
              this.setAttrInfo(e);
            }}
            deleteAll={e => {
              this.deleteAll(e);
            }}
            placeholder="输入姓名"
          />
          <WhiteSpace size="lg" />
          <Input
            name="consigneeMobile"
            value={addressInfo.consigneeMobile}
            placeholder="输入联系方式"
            handleChange={e => {
              this.setAttrInfo(e);
            }}
            deleteAll={e => {
              this.deleteAll(e);
            }}
          />
          <WhiteSpace size="lg" />

          {/* <Input
            name="province"
            value={`${addressInfo.addressProvince}${addressInfo.addressCity}${
              addressInfo.addressDistrict
            }`}
            placeholder="选择省市"
            readOnly
            hasRightButton
            onClick={() => this.props.history.push("/address/citys")}
          /> */}
          <WhiteSpace size="lg" />
          <Input
            name="street"
            value=""
            placeholder="选择街道"
            hasRightButton
            readOnly
            value={`${addressInfo.addressProvince}${addressInfo.addressCity}${
              addressInfo.addressDistrict
            }${addressInfo.addressRegion}`}
            onClick={() => this.props.history.push("/address/search")}
          />
          <WhiteSpace size="lg" />
          <Input
            name="addressDetail"
            value={addressInfo.addressDetail}
            placeholder="输入门牌号"
            handleChange={e => {
              this.setAttrInfo(e);
            }}
            deleteAll={e => {
              this.deleteAll(e);
            }}
          />
          <div className="tagList">
            <Radio
              list={alias}
              callBackHandel={item => {
                console.log("====================================");
                console.log(item);
                console.log("====================================");
                let _temp = {};
                _temp["addressAlias"] = item.value;
                this.props.setAddressesInfo(
                  Object.assign({}, this.props.addressInfo, _temp)
                );
              }}
            />
          </div>
        </div>
        <div className="confirm_btn">
          <div
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            <AudioButton
              buttonType="confirm"
              content="取消"
              config={{
                width: "280px",
                height: "72px",
                color: "white",
                fontSize: "30px",
                lineHeight: "53px",
                backgroundColor: "rgba(43,84,142,1)",
                border: "none",
                borderRadius: "36px",
                padding: "10px 80px 10px 80px"
              }}
            />
          </div>
          <div
            onClick={() => {
              console.log(addressInfo);
              this.addOrUpdateAddress(addressInfo);
            }}
          >
            <AudioButton
              buttonType="confirm"
              content="完成"
              config={{
                width: "280px",
                height: "72px",
                color: "white",
                fontSize: "30px",
                lineHeight: "53px",
                backgroundColor: "rgba(43,84,142,1)",
                border: "none",
                borderRadius: "36px",
                padding: "10px 80px 10px 80px"
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

var styles = {
  container: {
    backgroundColor: "#FFFFFF"
  },
  textStyle: {
    fontSize: "14px",
    backgroundColor: "#FFFFFF",
    width: "92%",
    height: "50px",
    lineHeight: "50px",
    borderBottom: "1px double #DADCDF",
    margin: "0 4%"
    // textAlign:'center'
  },
  textStyleNoline: {
    fontSize: "14px",
    backgroundColor: "#FFFFFF",
    width: "92%",
    height: "50px",
    lineHeight: "50px",
    margin: "0 4%"
    // textAlign:'center'
  },
  select: {
    display: "inline",
    margin: "0 50px"
  },
  selectTag: {
    display: "inline-block",
    fontSize: "12px",
    border: "1px solid #8B8B96",
    color: "#8B8B96",
    borderRadius: "7px",
    textAlign: "center",
    lineHeight: "25px",
    width: "70px",
    margin: "0 0 0 10px"
  },
  inputStyle: {
    marginLeft: "60px"
  },
  buttonStyle: {
    width: "92%",
    margin: "450px 4% 10px",
    backgroundColor: "#1687FF",
    color: "#FFFFFF",
    fontSize: "18px"
  }
};
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
)(UpdateAddress);
