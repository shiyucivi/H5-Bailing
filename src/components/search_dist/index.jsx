import React from "react";
import "./index.scss";
import { debounce } from "lodash";

let autocomplete = null;
class AddressSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.search = debounce(this.search, 500);
  }
  search = text => {
    const { onChange } = this.props;
    autocomplete.search(text, (status, pois) => {
      onChange(status, pois);
    });
  };
  handleChange = event => {
    event.persist();
    this.setState({
      value: event.target.value
    });

    this.search(event.target.value);
  };
  componentDidMount() {
    const {
      addressProvince,
      addressCity,
      addressDistrict,
      addressRegion
    } = this.props.addressInfo;
    // 根据城市或经纬度嗖嗖
    window.AMap.plugin("AMap.PlaceSearch", () => {
      var autoOptions = {
        city: "", //城市，默认全国
        citylimit: true,
        extensions: "all"
        // input: "detail_local" //使用联想输入的input的id
      };
      autocomplete = new window.AMap.PlaceSearch(autoOptions);
      this.search(
        ` ${addressProvince}${addressCity}${addressDistrict}${addressRegion}`
      );
      this.setState({
        value: ` ${addressProvince}${addressCity}${addressDistrict}${addressRegion}`
      });
    });
  }

  render() {
    const { placeholder } = this.props;
    const { value } = this.state;

    return (
      <div className="search_map_wrap">
        <div className="search_map">
          <div className="search_map_body">
            <img
              src={require("../../assets/icon/audio/ic_carbook_search_search.png")}
              alt="search_icon"
            />
            <input
              value={value}
              onChange={e => this.handleChange(e)}
              placeholder={placeholder}
            />
          </div>
          {value && value.length > 0 && (
            <img
              src={require("../../assets/icon/audio/ic_carbook_search_delete.png")}
              alt="search_icon"
              onClick={() => {
                this.setState({
                  value: ""
                });
              }}
            />
          )}
        </div>
        <div onClick={() => this.search(value)}>搜索</div>
      </div>
    );
  }
}

export default AddressSearch;
