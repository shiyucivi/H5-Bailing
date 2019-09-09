import React from "react";
import Nav from "../../components/nav";
import { setAddressesInfo } from "../../reducer/action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SearchDist from "../../components/search_dist";
import { LAUNCH_TARGET_POI } from "../../config/native_bridge";
import Util from "../../util/JsonUtil";
import base64url from "base64-url";
import "./index.scss";
let geolocation = null;
class AddressSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signAddrList: {
        name: "",
        addr: "",
        longitude: 0,
        latitude: 0
      },
      geocoder: "",
      searchContent: "",
      isChose: false,
      value: "",
      addressItem: [],
      from: "",
      source: {
        //来源 从native进入直接点击地址返回给native
        from: "",
        self: {
          addressComponent: { township: "" },
          position: { lat: "", lng: "" }
        }
      }
    };
  }
  handleChange = event => {
    this.setState({
      value: event.target.value
    });
  };
  componentWillMount() {
    /**
     *下一步、下单、锁座”
     *
     */
    window["_NEXT"] = () => {
      // this.order();
    };
  }
  componentDidMount() {
    //来源判断 如果直接从native进入则点击选择地址回调到native
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
  }
  //获取街道列表渲染
  renderAddressItem = (e, value) => {
    if (e === "complete") {
      const { poiList } = value;
      console.log("====================================");
      console.log(poiList);
      console.log("====================================");
      this.setState({
        addressItem: poiList.pois
      });
    }
  };
  render() {
    const { addressItem, from } = this.state;
    const { addressInfo } = this.props;
    // 确认区域
    const confirmDist = () => {
      this.props.history.goBack();
    };
    const selectDist = e => {
      let address = {
        latitude: e.location.lat,
        longitude: e.location.lng,
        adcode: e.adcode,
        addressProvince: e.pname,
        addressCity: e.cityname,
        addressDistrict: e.adname,
        addressRegion: e.address + e.name
      };
      if (from == "native") {
        LAUNCH_TARGET_POI(address);
      } else {
        let _temp = Object.assign(this.props.addressInfo, address);
        this.props.setAddressesInfo(_temp);
        this.props.history.goBack();
      }
    };

    return (
      <div className="search_dist zoom_audio">
        <Nav
          title="选择街道"
          mode="audio"
          rightButton={
            <SearchDist
              placeholder="请输入地区、街道"
              addressInfo={addressInfo}
              onChange={(e, value) => this.renderAddressItem(e, value)}
            />
          }
          leftButtonClick={this.props.history.goBack}
        />

        <ul className="addr_body">
          {addressItem.map((item, index) => (
            <li onClick={() => selectDist(item)} key={index}>
              <p>
                <img
                  src={require("../../assets/icon/audio/ic_hotel_add.png")}
                  alt=""
                />
                {item.district} {item.address}
                {item.name}
              </p>
            </li>
          ))}
        </ul>
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
)(AddressSearch);
