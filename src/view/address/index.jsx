import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setAddresses, setCurrentAddress } from "../../reducer/action";
import Nav from "../../components/nav";
import { Toast } from "antd-mobile";
import API from "../../config/api/";
import Radio_List from "../../components/radio_list";
import { LAUNCH_TARGET_POI } from "../../config/native_bridge";
import "./index.scss";
import AudioButton from "../../components/button/PayConfirmButton";
import Util from "../../util/JsonUtil";

let lastsel = 0;
let geolocation = null;
class AddressPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressList: [],

      merchant_info: {
        extra_lvl1: '{"channel_type":2,"commodity_category":1,"order_data":{}}',
        extra_lvl2: "",

        merchant_id: "2012002",
        merchant_longitude: 116.353917,
        merchant_latitude: 40.008612
      },
      from: "",
      source: {
        from: "",
        self: {
          addressComponent: { township: "" },
          position: { lat: "", lng: "" }
        }
      },
      current_address: null
    };
  }

  componentDidMount() {
    //从native进入传入店铺地址和用户当前地址信息
    //address/list?shop= &self=&from=native/h5
    if (this.props.location.search) {
      let query = Util.getQueryString("from", this.props.location.search);
      query = JSON.parse(decodeURIComponent(query));
      switch (query.from) {
        case "native":
          this.setState({
            source: query,
            from: query.from
          });
          break;
        case "h5":
          this.setState({
            source: query,
            from: query.from
          });
          break;
        default:
          break;
      }
      console.log(query.from, "====================================");
      console.log(query);
      console.log("====================================");
    }
    window.AMap.plugin(["AMap.Geolocation"], () => {
      // located
      geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new window.AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });

      // //  mapObj.addControl(geolocation);
      // geolocation.getCurrentPosition((status, result) => {
      //   console.log(status, result);
      //   const { addressComponent } = result;
      //   if (status == "status") {
      //     this.setState({
      //       addressComponent: addressComponent
      //     });
      //   }
      // });
      // window.AMap.event.addListener(geolocation, "complete", res =>
      //   console.log(res)
      // ); //返回定位信息
      // window.AMap.event.addListener(geolocation, "error", err =>
      //   console.log(err)
      // ); //返回定位出错信息
    });
    API.getAddressList().then(res => {
      if (res.status == 0 && res.msg == "SUCCESS") {
        if (res.data && res.data !== []) {
          // 回填选项
          let _list = this.props.addresses;

          _list &&
            res.data.map(item => {
              item.disable = false;
              _list.forEach(element => {
                if (item.addressId == element.addressId) {
                  item.sel = element.sel;
                }
              });
            });
          this.setState({
            addressList: res.data
          });
          if (this.state.from !== "native") {
            this.checkDelivery();
          }
        }
      } else {
        Toast.info(res.msg, 3);
      }
    });
  }
  //检查地址配送范围

  checkDelivery = () => {
    let resultList = [];

    this.state.addressList.forEach(item => {
      resultList.push({
        longitude: item.longitude,
        latitude: item.latitude,
        id: item.addressId
      });
    });

    this.state.merchant_info.addresses = resultList;
    API.checkDelivery(this.state.merchant_info).then(res => {
      if (res.status == 0) {
        let old_addressList = this.state.addressList.concat();
        let { addresses } = res.data;
        addresses.forEach((item, index) => {
          old_addressList[index].disable = item.deliverable;
        });
        this.setState({
          addressList: old_addressList
        });
      }
    });
  };
  onChange = val => {
    for (let streamKey in this.state.addressList) {
      console.log(this.state.addressList[streamKey].addressId);
      if (
        lastsel !== 0 &&
        lastsel === this.state.addressList[streamKey].addressId
      ) {
        console.log("a" + this.state.addressList[streamKey].addressId);
        this.state.addressList[streamKey].sel = false;
      }
    }
    lastsel = val.addressId;
    val.sel = !val.sel;
    // console.log(val);
  };

  onClick = address => {
    console.log(address);
  };

  // 修改地址信息
  editItem = item => {
    this.props.history.push({
      pathname: "/address/updateAddress",
      query: { item: item }
    });
  };

  //保存已选跳转
  update = () => {
    const { from, current_address } = this.state;
    if (from == "h5") {
      // this.props.history.goBack();
      this.props.setCurrentAddress(current_address);
    } else {
      //native
      LAUNCH_TARGET_POI(current_address);
    }
    this.props.history.goBack();
  };

  render() {
    const data = this.state.addressList
      .sort((a, b) => {
        let v1 = a.disable;
        let v2 = b.disable;
        if (v1 && !v2) {
          return -1;
        } else if (!v1 && v2) {
          return 1;
        } else {
          return 0;
        }
      })
      .reverse();

    const { from, source } = this.state;

    return (
      <div className="address_list_wrap zoom_audio">
        <Nav
          mode="audio"
          title="地址信息"
          leftButton
          rightButton={
            from == "native" && (
              <p
                style={{
                  minWidth: "150px",
                  fontSize: "30px",
                  fontWeight: "400",
                  color: "rgba(255, 255, 255, 0.6)"
                }}
              >
                <img
                  style={{
                    width: "24px",
                    height: "24px",
                    marginRight: "10px"
                  }}
                  src={require("../../assets/icon/audio/ic_hotel_add.png")}
                />
                {`${source.self.addressComponent.township || "...."}`}
              </p>
            )
          }
          leftButtonClick={this.props.history.goBack}
        />
        <div
          onClick={() =>
            this.editItem({
              consignee: "",
              consigneeMobile: "",
              addressProvince: "",
              addressCity: "",
              addressDistrict: "",
              addressRegion: "",
              addressDetail: "",
              createId: "",
              latitude: "",
              longitude: "",
              addressID: "",
              addressType: "",
              addressAlias: ""
            })
          }
          className="confirm_btn"
        >
          <AudioButton
            buttonType="confirm"
            content="+新增"
            config={{
              width: "320px",
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
        <div className="address_list">
          {data && data.length > 0 && (
            <Radio_List
              list={data}
              renderItem={i => (
                <div className={`${i.disable ? "" : "disable"}`}>
                  <div>
                    <p>
                      <span>{i.consignee}</span>
                      <span>{i.consigneeMobile}</span>
                    </p>
                    <p>{i.fullAddress}</p>
                  </div>
                  <div className="btn_group">
                    <div onClick={() => this.editItem(i)}>
                      <img
                        src={require("../../assets/icon/ic_orders_airticket_edit@2x.png")}
                      />
                    </div>
                    <div onClick={() => this.editItem(i)}>
                      <img
                        src={require("../../assets/icon/audio/ic_carbook_search_delete.png")}
                      />
                    </div>
                  </div>
                </div>
              )}
              callBackHandel={e => {
                console.log("callback", e);
                this.setState({
                  current_address: e
                });
              }}
            />
          )}
        </div>

        <div onClick={() => this.update()} className="confirm_btn">
          <AudioButton
            buttonType="confirm"
            content="完成"
            config={{
              width: "560px",
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
    );
  }
}

function mapStateToProps(state) {
  return {
    addresses: state.userReducer.addresses,
    current_address: state.userReducer.current_address
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setAddresses: bindActionCreators(setAddresses, dispatch),
    setCurrentAddress: bindActionCreators(setCurrentAddress, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressPage);
var styles = {
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  topAir: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
    // padding: "0 5%"
  },
  flexR: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    lineHeight: "15px",
    paddingLeft: "20px"
  },

  edit: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  gray: {
    color: "#535366"
  }
};
