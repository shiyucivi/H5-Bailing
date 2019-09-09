import React from "react";
import { PickerView } from "antd-mobile";
import arrayTreeFilter from "array-tree-filter";
import citys from "../../config/citys";
class Citys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // decode区域编码
    const decode = e => {
      const value = e;
      if (!value) {
        return "";
      }
      const treeChildren = arrayTreeFilter(
        citys,
        (c, level) => c.value === value[level]
      );
      const address_text = treeChildren.map(v => v.label);
      this.props.onChange({
        address_code: e,
        addressProvince: address_text[0],
        addressCity: address_text[1],
        addressDistrict: address_text[2]
      });
    };
    const pickChange = e => {
      // 及时改变城市代码
      decode(e);
    };
    return (
      <div>
        <div className="city_picker">
          <PickerView
            data={citys}
            value={this.props.citys_code}
            onChange={pickChange}
            itemStyle={{
              color: "rgba(255, 255, 255, .33)",
              fontSize: "30px"
            }}
          />
        </div>
      </div>
    );
  }
}

export default Citys;
