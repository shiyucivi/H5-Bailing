import React from "react";
import API from "../../config/api/";
import "./index.scss";
import Nav from "../../components/nav";
import { Carousel } from "antd-mobile";

class CookBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dish: {
        steps: [
          {
            des: "",
            index: -1,
            pic: ""
          }
        ],
        id: "",
        material: [],
        img: "",
        name: "",
        is_ad: 0,
        time_long: "",
        num: -1,
        pv: -1,
        main_material: [],
        level: ""
      },
      materialOrStep: "material", //显示原料还是步骤
      selectedIndex: 0, //当前step索引
      infinite: true
    };
  }

  componentDidMount() {
    if (this.props.match.params && this.props.match.params.id) {
      API.getCookBook(this.props.match.params.id).then(res => {
        this.setState({
          dish: res
        });
      });
    }

    //document.querySelector(".my-carousel").addEventListener('touch',this.stepUpToTop,{passive:false})
  }

  materialDownToBottom = () => {
    let materialScrollHeight = document.querySelector(".material").scrollTop; //原料部分滚动条下滑的距离
    let scrollHeight = document.querySelector(".material").scrollHeight; //原料部分的总高度（滚动高度）

    if (materialScrollHeight > 1534) {
      this.setState({ materialOrStep: "step" });
    }
  };

  stepUpToTop = () => {
    let StepScrollHeight = document.querySelector(".my-carousel").scrollTop; //步骤部分滚动条下滑的距离
    let scrollHeight = document.querySelector(".my-carousel").scrollHeight; //步骤部分的总高度（滚动高度）
  };

  render() {
    const { dish, materialOrStep, selectedIndex, infinite } = this.state;
    const afterChange = (from, to) => {
      if (from == 0 && to == dish.steps.length - 1) {
        this.setState({
          selectedIndex: 0,
          materialOrStep: "material"
        });
      } else if (to == 0 && from == dish.steps.length - 1) {
        return false;
      }
    };
    return (
      <div className="zoom_audio cook_wrap">
        <Nav
          mode={"audio"}
          leftButtonClick={this.props.history.goBack}
          title={"做饭模式"}
          showRightButton={true}
          rightButtonValue={materialOrStep === "material" ? "原料" : "步骤"}
        />
        <div className="cook_content">
          {materialOrStep === "material" ? (
            <ul className="material" onScroll={this.materialDownToBottom}>
              {dish.main_material.map((item, index) => (
                <li key={index} className="material_list_text">
                  <span style={{ float: "left", width: 0 }}>{index + 1}</span>
                  <span style={{ marginLeft: "130px" }}>
                    {item.split(":")[0]}
                  </span>
                  <span style={{ float: "right" }}>{item.split(":")[1]}</span>
                  <div className="split" />
                </li>
              ))}
            </ul>
          ) : (
            <Carousel
              className="my-carousel"
              vertical
              dots={false}
              dragging={false}
              infinite={false}
              swiping={true}
              beforeChange={(from, to) => afterChange(from, to)}
              selectedIndex={selectedIndex}
              // autoplay
              infinite={infinite}
            >
              {dish.steps.map((item, index) => (
                <div key={index} className="step_list_text">
                  <span>
                    {item.pic && (
                      <img
                        style={{
                          width: "280px",
                          marginRight: "81px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          fontSize: "30px"
                        }}
                        src={item.pic}
                      />
                    )}
                  </span>
                  <div
                    style={{
                      float: "right",
                      color: "rgba(255,255,245,0.6)"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "44px",
                        fontWeight: "bold",
                        color: "#ffffff"
                      }}
                    >
                      {index + 1}/{dish.steps.length}
                    </div>
                    <div className="split" />
                    <span>{item.des}</span>
                  </div>
                </div>
              ))}
            </Carousel>
          )}
          <p className="indicate_text">
            <span>试试</span>
            <span>“你好小蓦，下一页”</span>
          </p>
        </div>
      </div>
    );
  }
}

export default CookBook;
