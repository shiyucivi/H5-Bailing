import React from "react";
import { connect } from "react-redux";
import {
  fetchMovieSeatmap,
  setSelectSeat,
  setSeatMap
} from "../../reducer/action";
import classnames from "classnames";
import { bindActionCreators } from "redux";
import { Toast, Modal } from "antd-mobile";
import { StorageUtil as Storage } from "../../util/index";
import { isAndroidOrios, exit } from "../../util/fetch";

import "./index.scss";
import Nav from "../../components/nav/audio_nav";
import API from "../../config/api";
const alert = Modal.alert;
//座位高度
const SEAT_WIDTH = 35;
const SEAT_HEIGHT = 33;
//画布宽/高 -》，默认300*150
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 150;
//设备像素比--解决失真问题
// 设备像素比->解决失真的问题
const ratio = window.devicePixelRatio;
const DRAW_SEAT_WIDTH = SEAT_WIDTH * ratio; //图片
const DRAW_SEAT_HEIGHT = SEAT_HEIGHT * ratio;
//画布
const DRAW_CANVAS_WIDTH = CANVAS_WIDTH * ratio; //画布
const DRAW_CANVAS_HEIGHT = CANVAS_HEIGHT * ratio;
//加载图片
const emptyImage = new Image();
const selectImage = new Image();
const soldImage = new Image();

class SeatMap extends React.Component {
  constructor(props) {
    super(props);

    const { match } = props;
    this.state = {
      row: 10,
      column: 10,
      section_id: "",
      roomInfo: [],
      filmInfo: {
        cinema_name: "",
        begin_time: "",
        language: "",
        hall_name: "",
        cinema_id: ""
      },
      seatCode: [],
      selectSeat: [],
      CANVAS_HEIGHT: CANVAS_HEIGHT,
      CANVAS_WIDTH: CANVAS_WIDTH,
      DRAW_CANVAS_WIDTH: DRAW_CANVAS_WIDTH,
      DRAW_CANVAS_HEIGHT: DRAW_CANVAS_HEIGHT,
      recommendSeat: [1, 2, 3, 4],
      seatRowIndex: [],
      preOrderParm: {
        extra_lvl1: JSON.stringify({
          channel_type: 0,
          commodity_category: 0,
          order_data: "{}"
        }),
        extra_lvl2: JSON.stringify({
          channel_type: 0,
          commodity_category: 0,
          order_data: "{}"
        }),

        show_id: "201908120087126",
        recomm_seat_num: ""
      }
    };
  }
  componentWillMount() {
    // native 交互方法
    /**
     *推荐座位 1~4
     *
     * @param {*} num
     */
    window["_RECOMMEND_SEAT"] = num => {
      alert(num);
      this.recommendSeat(num);
    };
    /**
     *下一步、下单、锁座”
     *
     */
    // window["_NEXT"] = () => this.orderMovie();
    window["_NEXT"] = () => {
      this.orderMovie();
    };
    /**
     *取消选座
     *
     */
    // window["_NEXT"] = () => this.orderMovie();
    window["_CANCEL_ALL_SEATS"] = () => {
      this.props.setSelectSeat([]);
    };
  }
  componentDidMount() {
    // 安卓下获取信息
    if (isAndroidOrios()[0] && window.AppBridge) {
      let result = JSON.parse(window.AppBridge.getData());
      result.summary = JSON.parse(result.summary);
      result.items = JSON.parse(result.items);
      this.setState(
        {
          preOrderParm: {
            extra_lvl1: JSON.stringify(result.summary.extra_lvl1),
            extra_lvl2: JSON.stringify(result.items.extra_lvl2),
            show_id: result.items.show_id,
            recomm_seat_num: ""
          }
        },
        () => {
          this.getData();
        }
      );
      return false;
    }

    this.getData();
  }
  getData = (params = this.state.preOrderParm) => {
    // 获取座位
    this.props.fetchMovieSeatmap(params, res => {
      //如果包含未支付订单

      if (res.unsettled_order_code) {
        alert("提示", "您有电影票订单未支付，是否取消订单？", [
          { text: "去支付", onPress: () => this.props.history.replace(`/`) },
          {
            text: "取消订单",
            onPress: () => this.cancelOrder(res.unsettled_order_code)
          }
        ]);
      }
      const sections = res.sections;
      let firstDistrict = sections[0];
      const seats = firstDistrict.seats;

      // 画布大小
      //canvas
      this.ctx = this.refs.canvas.getContext("2d");
      this.ctx.font = `${10 * ratio}px Arial`;
      this.ctx.fillStyle = "#fff";
      this.ctx.textAlign = "center";

      emptyImage.src = require("../../assets/img/ic_movie_seat_normal.png");
      selectImage.src = require("../../assets/img/ic_movie_seat_selected.png");
      soldImage.src = require("../../assets/img/ic_movie_seat_disabled.png");
      let count = 0;
      const loadCallback = () => {
        count++;
        if (count == 3) {
          this.emptyImage = emptyImage;
          this.selectImage = selectImage;
          this.soldImage = soldImage;
          this.drawAllSeat(); //init drao
        }
      };
      emptyImage.onload = loadCallback();
      selectImage.onload = loadCallback();
      soldImage.onload = loadCallback();
      const lastSeat = seats[seats.length - 1];

      const CANVAS_WIDTH = Number(lastSeat.column_no) * SEAT_WIDTH;
      const CANVAS_HEIGHT = Number(lastSeat.row_no) * SEAT_HEIGHT;

      //画布
      const DRAW_CANVAS_WIDTH = CANVAS_WIDTH * ratio; //画布
      const DRAW_CANVAS_HEIGHT = CANVAS_HEIGHT * ratio;
      // 座位
      const DRAW_SEAT_WIDTH = SEAT_WIDTH * ratio; //图片
      const DRAW_SEAT_HEIGHT = SEAT_HEIGHT * ratio;

      this.setState({
        row: firstDistrict.max_column,
        column: firstDistrict.max_row,
        section_id: firstDistrict.id,
        roomInfo: sections,
        filmInfo: res,
        seats: seats,
        CANVAS_WIDTH: CANVAS_WIDTH,
        CANVAS_HEIGHT: CANVAS_HEIGHT,
        DRAW_CANVAS_WIDTH: DRAW_CANVAS_WIDTH,
        DRAW_CANVAS_HEIGHT: DRAW_CANVAS_HEIGHT,
        DRAW_SEAT_WIDTH: DRAW_SEAT_WIDTH,
        DRAW_SEAT_HEIGHT: DRAW_SEAT_HEIGHT
      });
      // 推荐座位
      const recommend_seats = firstDistrict.recommend_seats;
      this.props.setSelectSeat(recommend_seats || []);
      // 生成座位
      this.code();
    });
  };
  //init draw
  drawAllSeat = () => {
    setTimeout(() => {
      const seatData = this.props.seatMap;
      const { DRAW_SEAT_WIDTH, DRAW_SEAT_HEIGHT } = this.state;
      let maxRow = 0;
      for (let i = 0; i < seatData.length; i++) {
        const { falg, row_no, column_no } = seatData[i];
        if (Number(column_no) > maxRow) {
          maxRow = column_no;
        }
        const offsetLeft = (column_no - 1) * DRAW_SEAT_WIDTH;
        const offsetTop = (row_no - 1) * DRAW_SEAT_HEIGHT;
        if (falg == 7) {
          //已售
          this.ctx.drawImage(
            this.soldImage,
            offsetLeft,
            offsetTop,
            DRAW_SEAT_WIDTH,
            DRAW_SEAT_HEIGHT
          );
        } else {
          //可选
          this.ctx.drawImage(
            this.emptyImage,
            offsetLeft,
            offsetTop,
            DRAW_SEAT_WIDTH,
            DRAW_SEAT_HEIGHT
          );
        }
      }
      //绘制虚线
      const solid_x = DRAW_SEAT_WIDTH * Math.ceil(Number(maxRow) / 2);
      this.ctx.beginPath();
      this.ctx.setLineDash([5]);
      this.ctx.lineWidth = 1 * this.state.radio;
      this.ctx.strokeStyle = "#ccc";

      this.ctx.moveTo(solid_x, 0);
      this.ctx.lineTo(solid_x, this.state.DRAW_CANVAS_HEIGHT + 10);
      this.ctx.stroke();
    }, 0);
  };
  // 每次状态改变都重新绘制
  componentDidUpdate(prevProps, prevState) {
    if (this.ctx) {
      //清空画布
      this.ctx.clearRect(
        0,
        0,
        this.state.DRAW_CANVAS_WIDTH,
        this.state.DRAW_CANVAS_HEIGHT
      );
      this.drawAllSeat(); // 再次绘制初始座位
      this.drawSelectSeat(); // 绘制选择的座位
    }
  }
  // 绘制选择的座位
  drawSelectSeat = () => {
    setTimeout(() => {
      const { selectSeat } = this.props;
      const { DRAW_SEAT_WIDTH, DRAW_SEAT_HEIGHT } = this.state;
      for (let i = 0; i < selectSeat.length; i++) {
        const { row_no, column_no, row_id, column_id } = selectSeat[i];
        const offsetLeft = (column_no - 1) * DRAW_SEAT_WIDTH;
        const offsetTop = (row_no - 1) * DRAW_SEAT_HEIGHT;
        this.ctx.drawImage(
          this.selectImage,
          offsetLeft,
          offsetTop,
          DRAW_SEAT_WIDTH,
          DRAW_SEAT_HEIGHT
        );
        // this.ctx.fillText(
        //   `${row_id}排`,
        //   offsetLeft + DRAW_SEAT_WIDTH / 2,
        //   offsetTop + DRAW_SEAT_HEIGHT / 2.5
        // );
        // this.ctx.fillText(
        //   `${column_id}座`,
        //   offsetLeft + DRAW_SEAT_WIDTH / 2,
        //   offsetTop + (DRAW_SEAT_HEIGHT * 2) / 3
        // );
      }
    }, 0);
  };
  // 取消订单锁座
  cancelOrder = order_code => {
    API.cancelOrder({
      order_code: order_code
    }).then(res => {
      if (res.status === 0 && res.message === "SUCCESS") {
        Toast.info("电影票取消成功", 2);
        setTimeout(() => {
          this.props.history.goBack();
        }, 1000 * 2);
        this.getData();
      } else {
        Toast.info(res.message, 2);
      }
    });
  };
  // 选择座位
  clickSeat = e => {
    const offset = this.refs.canvas.getBoundingClientRect();
    const clickX = e.pageX - offset.left; //相对视口的e.pageX/Y - canvas画布相对视口大小
    const clickY = e.pageY - offset.top;
    const xPox = Math.ceil(clickX / SEAT_WIDTH);
    const yPox = Math.ceil(clickY / SEAT_HEIGHT);
    // 查找座位
    const seat = this.props.seatMap.find(
      seat => Number(seat.row_no) === yPox && Number(seat.column_no) === xPox
    );

    // 若没有找到或已售，则不响应
    if (!seat || seat.isSold) {
      return;
    }

    const seatIndex = this.props.selectSeat.findIndex(
      item => item.seat_no === seat.seat_no
    );
    // 若不等于-1 -> 若选择，则取消选择，反之选择座位
    if (seatIndex > -1) {
      let tempArray = this.props.selectSeat.filter(
        item => item.seat_no !== seat.seat_no
      );
      this.props.setSelectSeat(tempArray);
    } else {
      if (this.props.selectSeat.length >= 4) {
        // 若已选四个座位，则不能再选
        alert("不能超过6个座位");
      } else {
        this.props.setSelectSeat([...this.props.selectSeat, seat]);
      }
    }
  };
  // 删除已选座位
  removeSelectSeat = seatNo => {
    let tempArray = this.props.selectSeat.filter(
      item => item.seat_no !== seatNo
    );
    this.props.setSelectSeat(tempArray);
  };
  //座位排序
  code = () => {
    let seatMapArray = this.computed_row_col();
    // 座位排数序列号
    let seatRowIndex = [];
    let count = 1;

    seatMapArray.map((item, index) => {
      let seatRowIndexExitFlag = false;
      item.map(jell => {
        if (jell.status !== "Null") {
          seatRowIndexExitFlag = true;
        }
        return this.classifySeat(jell);
      });
      // 如果一行存在座位正常排列index否则为空值index
      if (seatRowIndexExitFlag) {
        seatRowIndex.push(count++);
      } else {
        seatRowIndex.push("");
      }
    });
    this.setState({
      seatCode: seatMapArray,
      seatRowIndex: seatRowIndex
    });

    this.props.setSeatMap(seatMapArray);
  };
  classifySeat = seatObj => {
    // 0不存在 1普通可以售卖  2已选 3、4 情侣座左右不可买  56情侣可买 7普通锁定

    switch (seatObj.status) {
      case "LK":
        //不可以售
        seatObj.falg = 7;
        seatObj.isSold = true;
        break;
      case "N":
        //普通可售
        seatObj.falg = 1;
        break;
      case "L":
        //情侣左可售
        seatObj.falg = 5;
        seatObj.isSold = true;

        break;
      case "R":
        //情侣右可售
        seatObj.falg = 6;
        seatObj.isSold = true;
        break;
      case "LL":
        //情侣左锁定
        seatObj.falg = 3;
        seatObj.isSold = true;

        break;
      case "RL":
        //情侣右锁定
        seatObj.falg = 4;
        seatObj.isSold = true;

        break;
      default:
        seatObj.falg = "_";
        break;
    }
  };
  computed_row_col = (x, y, existSet = []) => {
    const { row, column, seats } = this.state;
    let pointSeatmap = [];

    for (let col = 0; col < Number(column) + 1; col++) {
      // column
      // 判断是否存在座位
      let _tempArr = [];

      for (let rr = 0; rr < row; rr++) {
        //row
        for (let cc = 0; cc < seats.length; cc++) {
          const existSeat = seats[cc];
          if (
            Number(existSeat.row_no) == col &&
            Number(existSeat.column_no) == rr
          ) {
            //填充已存在座位
            _tempArr.push(existSeat);
          }
        }
        for (let cc = 0; cc < seats.length; cc++) {
          // 填充走廊
          var result = _tempArr.some(function(item) {
            if (Number(item.row_no) == col && Number(item.column_no) == rr) {
              return true;
            }
          });
          if (!result) {
            _tempArr.push({
              column_no: rr,
              row_no: col,
              status: "Null"
            });
          }
        }
        _tempArr.sort((a, b) => a.row_no > b.row_no);
      }

      pointSeatmap[col] = _tempArr;
    }

    return pointSeatmap;
  };
  // onpress
  onpress = item => {
    if (item.seat_no) {
      if (item.falg == 1) {
        item.falg = "+";
        this.setState({
          selectSeat: [...this.state.selectSeat, item]
        });
      } else {
        item.falg = 1;
        this.setState({
          selectSeat: this.state.selectSeat.filter(
            jeel => jeel.seat_no !== item.seat_no
          )
        });
      }
    }
  };
  // 推荐座位
  recommendSeat = num => {
    this.getData(
      Object.assign({}, this.state.preOrderParm, { recomm_seat_num: num })
    );
  };
  //为座位信息加入场区id
  addSectionidToseat = seatArray => {
    seatArray.map(seat => (seat.section_id = this.state.section_id));
    return seatArray;
  };
  // 下单锁座
  orderMovie = () => {
    const { preOrderParm, filmInfo } = this.state;
    const { selectSeat } = this.props;
    let obj = {
      extra_lvl1: preOrderParm.extra_lvl1,
      extra_lvl2: preOrderParm.extra_lvl2,
      contact: "",
      contact_phone: "",
      comment: "",

      total_price: (filmInfo.price * selectSeat.length).toFixed(2),
      cinema_id: filmInfo.cinema_id,
      show_id: preOrderParm.show_id,
      selected_seats: this.addSectionidToseat(this.props.selectSeat)
    };
    API.order(obj, "movie").then(res => {
      if (res.status == 0 && res.message == "SUCCESS") {
        // Storage.save("obj", obj);
        Toast.info("电影票下单成功", 2);
        // 跳转电影票确认支付页面
        this.props.history.push(`/order/confirm/${res.data.order_code}`);
      } else {
        Toast.info(res.message, 2);
      }
    });
  };
  render() {
    const { selectSeat } = this.props;
    const { seatCode, filmInfo, recommendSeat, seatRowIndex } = this.state;

    const pay_able = !(selectSeat && selectSeat.length > 0);
    const TVseatMap = seatCode.map((jell, index) => (
      <div className="seatMap" key={index}>
        {jell.map(item => (
          <div
            onClick={() => this.onpress(item)}
            key={`${item.row_no}_${item.column_no}`}
          >
            <p>{item.row_id && `${item.row_id}排${item.column_id} 座`}</p>
            {/* {item.falg} */}
          </div>
        ))}
      </div>
    ));
    return (
      <div className="movie_wrap ">
        <Nav
          title={filmInfo.cinema_name}
          leftButton
          leftButtonClick={() => {
            exit();
          }}
        />
        {/* 影院信息 */}
        <div className="movie_wrap_info">
          <span>{filmInfo.show_name}</span>
          <span>{filmInfo.begin_time}</span>
          <span>{filmInfo.language}</span>
          <span>{filmInfo.hall_name}</span>
        </div>
        {/* 座位引导 */}
        <div className="movie_seat_direct">
          <span>
            可选
            <img
              src={require("../../assets/img/ic_movie_seat_sign_normal.png")}
            />
          </span>
          <span>
            不可选
            <img
              src={require("../../assets/img/ic_movie_seat_sign_disabled.png")}
            />
          </span>
          <span>
            已选
            <img
              src={require("../../assets/img/ic_movie_seat_sign_selected.png")}
            />
          </span>
          <span>
            情侣座
            <img
              src={require("../../assets/img/ic_movie_seat_sign_lovers@2x.png")}
            />
          </span>
        </div>
        {/* 座位图 */}
        <div id="container" className="movie_wrap_content">
          {/* {普通canvasseatMap} */}
          <dir className="movie_map">
            <div className="movie_map_content">
              <div className="screen_bar" />
              <canvas
                onClick={this.clickSeat}
                style={{
                  width: this.state.CANVAS_WIDTH,
                  height: this.state.CANVAS_HEIGHT
                }}
                ref="canvas"
                width={this.state.DRAW_CANVAS_WIDTH}
                height={this.state.DRAW_CANVAS_HEIGHT}
              />
            </div>
            <div className="listTag">
              {seatRowIndex.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          </dir>

          <div className="movie_select">
            {selectSeat && selectSeat.length > 0 ? (
              <div>
                <p>已选座位</p>
                <div className="selected">
                  {selectSeat.map(item => (
                    <span
                      onClick={() => this.removeSelectSeat(item.seat_no)}
                      key={item.seat_no}
                    >
                      {item.row_id}排{item.column_id}座
                      <img
                        src={require("../../assets/img/ic_movie_seat_close@2x.png")}
                      />
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p>推荐座位</p>
                <div className="recommend">
                  {recommendSeat.map((item, index) => (
                    <span
                      onClick={() => {
                        this.recommendSeat(item);
                      }}
                      key={index}
                    >
                      {item}人
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              {/* 价格 */}
              {!pay_able && (
                <div className="price_info">
                  <span>总价：</span>
                  <span>
                    ￥{(filmInfo.price * selectSeat.length).toFixed(2)}
                  </span>
                  {/* <span>
                    ￥{(filmInfo.price * selectSeat.length).toFixed(2)}
                  </span> */}
                </div>
              )}

              {/* btn */}

              <div
                className={classnames("pay_btn", {
                  noway: pay_able
                })}
                onClick={() => {
                  if (!pay_able) {
                    Toast.loading("正在为您订座", 3, () => {
                      this.orderMovie();
                    });
                  }
                }}
              >
                {pay_able ? "请先选座" : "确认选座"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  seatMap: state.orderReducer.seatMap,
  selectSeat: state.orderReducer.selectSeat
});

function mapDispatchToProps(dispatch) {
  return {
    fetchMovieSeatmap: bindActionCreators(fetchMovieSeatmap, dispatch),
    setSelectSeat: bindActionCreators(setSelectSeat, dispatch),
    setSeatMap: bindActionCreators(setSeatMap, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeatMap);
