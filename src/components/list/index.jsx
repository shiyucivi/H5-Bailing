import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { setListState } from "../../reducer/action";
import { bindActionCreators } from "redux";
// import { setLocalStorage, getLocalStorage } from "../../util/util";
/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import { PullToRefresh, ListView, Toast } from "antd-mobile";
import API from "../../config/api/";
import { isAndroidOrios } from "../../util/fetch";

import Card from "../card";
let DEVICE = "1";

/**
 *抛出list列表
 *
 * @export
 * @class List
 * @extends {React.Component}
 */
class List extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      dataSource,
      height: document.documentElement.clientHeight,
      datas: [],
      pageIndex: 1,
      page_size: 10,
      refreshing: true,
      isLoading: true,
      useBodyScroll: false,
      dataBlobs: {},
      sectionIDs: [],
      rowIDs: [],
      dataArr: [] //关键代码
    };
  }
  /**
   *fetch datalist
   *
   * @param {boolean} [ref=false]
   * @memberof List
   */
  genData(ref = false) {
    //获取数据

    let that = this;
    let parma = {
      page_size: this.state.page_size,
      current_page: this.state.pageIndex,
      status: this.props.status || "",
      commodity_category: DEVICE ? [0, 2, 3, 4] : [3, 4]
    };

    API.getOrderList(parma)
      .then(res => {
        if (res) {
          res = res.reverse();
          res = res.filter(
            item =>
              item.commodity_category == 0 ||
              item.commodity_category == 2 ||
              item.commodity_category == 3 ||
              item.commodity_category == 4
          );
          const lg = res.length;
          if (lg <= 0) {
            Toast.info("没有数据了~", 1);
            this.setState({
              refreshing: false,
              isLoading: false
            });
            return false;
          }
          let dataArr = that.state.dataArr; //关键代码
          let m = that.state.datas;
          if (ref) {
            dataArr = [];
            m = [];
          }
          for (let i = 0; i < lg; i++) {
            //每一次读取的数据都进行保存一次
            dataArr.push(`row - ${that.state.pageIndex * lg + i}`);
            m.push(res[i]);
          }
          if (ref) {
            //这里表示刷新使用
            that.setState({
              datas: res,
              pageIndex: 1,
              dataSource: that.state.dataSource.cloneWithRows(dataArr),
              refreshing: false,
              isLoading: false,
              //保存数据进state
              dataArr: dataArr
            });
          } else {
            //这里表示上拉加载更多
            that.rData = {
              ...that.rData,
              ...dataArr
            };
            that.setState({
              datas: m,
              pageIndex: that.state.pageIndex,
              dataSource: that.state.dataSource.cloneWithRows(that.rData),
              refreshing: false,
              isLoading: false,
              //保存数据进state
              dataArr: dataArr
            });
          }
        } else {
          Toast.info(res, 1);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  componentDidUpdate() {}
  /**
   *初始化列表
   *
   * @memberof List
   */
  componentDidMount() {
    // 安卓下获取信息
    if (isAndroidOrios()[0] && window.AppBridge) {
      //维护手机 音响类别 支付方式不同
      if (window.AppBridge.getSystemModel) {
        DEVICE = window.AppBridge.getSystemModel();
      }
    }
    if (this.state.useBodyScroll) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    this.timer = setTimeout(
      () =>
        this.setState({
          height: hei
        }),
      0
    );
    if (this.props.listState && this.props.listState.datas.length !== 0) {
      this.setState(
        {
          datas: this.props.listState.datas,
          pageIndex: this.props.listState.pageIndex,
          page_size: this.props.listState.page_size,
          dataArr: this.props.listState.dataArr,
          dataSource: this.state.dataSource.cloneWithRows(
            this.props.listState.dataArr
          ),
          refreshing: false,
          isLoading: false
        },
        () => {
          ReactDOM.findDOMNode(
            this.lv
          ).scrollTop = this.props.listState.scrollTop;
        }
      );
    } else {
      this.genData(true);
    }
  }

  /**
   *解决内存泄露
   *
   * @memberof List
   */
  componentWillUnmount = () => {
    clearTimeout(this.timer);
    clearTimeout(this.timer1);
    this.setState = (state, callback) => {
      return;
    };
  };
  /**
   *下拉刷新
   *
   * @memberof List
   */
  onRefresh = () => {
    let that = this;
    this.setState({
      refreshing: true,
      isLoading: true,
      pageIndex: 0
    });
    this.timer1 = setTimeout(() => {
      that.genData(true);
    }, 2000);
  };
  /**
   *跳转页面
   *
   * @memberof List
   */
  linkTap = item => {
    this.props.setListState({
      scrollTop: ReactDOM.findDOMNode(this.lv).scrollTop,
      datas: this.state.datas,
      pageIndex: this.state.pageIndex,
      page_size: this.state.page_size,
      dataArr: this.state.dataArr
    });
    // 跳转方法
    switch (item.commodity_category) {
      case 0:
        // 跳转不同的详情页面 movie
        if (DEVICE) {
          // 音响跳转音响订单详情页面
          this.props.nav.history.push(
            `/order/movie/detail/${item.order_code}?type=detail`
          );
        } else {
          this.props.nav.history.push({
            pathname: "/order/movie/detail/" + `${item.order_code}`,
            query: {
              item: item
            }
          });
        }

        break;
      case 2:
        // 跳转不同的详情页面 takeout
        if (DEVICE) {
          // 音响跳转音响订单详情页面
          this.props.nav.history.push(
            `/order/takeout/detail/${item.order_code}`
          );
        } else {
          this.props.nav.history.push({
            pathname: "/order/takeout/detail/" + `${item.order_code}`,
            query: {
              item: item
            }
          });
        }

        break;
      case 3:
        // 跳转不同的详情页面
        if (DEVICE) {
          // 音响跳转音响订单详情页面
          // this.props.nav.history.push(
          //   `/order/hotel/pay_audio/${item.order_code}?type=detail`
          // );
          this.props.nav.history.push({
            pathname: "/order/hotel/" + `${item.order_code}`,
            query: {
              item: item
            }
          });
        } else {
          this.props.nav.history.push({
            pathname: "/order/hotel/" + `${item.order_code}`,
            query: {
              item: item
            }
          });
        }

        break;
      default:
        // 跳转不同的详情页面
        if (DEVICE) {
          // 音响跳转音响订单详情页面
          // this.props.nav.history.push(
          //   `/order/air/pay_audio/${item.order_code}?type=detail`
          // );
          this.props.nav.history.push({
            pathname: "/order/air/" + `${item.order_code}`,
            query: { item: item }
          });
        } else {
          this.props.nav.history.push({
            pathname: "/order/air/" + `${item.order_code}`,
            query: { item: item }
          });
        }
    }
  };
  /**
   *触底反馈
   *
   * @memberof List
   */
  onEndReached = event => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageIndex: this.state.pageIndex + 1
    });
    let that = this;
    setTimeout(() => {
      that.genData(false);
    }, 1000);
  };
  /**
   *渲染方法
   *
   * @returns
   * @memberof List
   */
  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        className="separator"
        style={{
          backgroundColor: "#F5F5F9",
          height: 10,
          borderTop: "1px solid #ECECED",
          borderBottom: "1px solid #ECECED"
        }}
      />
    );
    let index = this.state.datas.length - 1;

    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = this.state.datas.length - 1;
      }
      const obj = this.state.datas[index--];
      return (
        <div onClick={() => this.linkTap(obj)} style={{ marginTop: "10px" }}>
          <Card
            title={obj.order_name}
            id={obj.order_code}
            date={obj.create_time}
            status={obj.order_status_name}
            totalPrice={obj.total_price}
          >
            {this.props.renderItem(obj)}
          </Card>
        </div>
      );
    };
    return (
      <div>
        <ListView
          key={this.state.useBodyScroll ? "0" : "1"}
          ref={el => (this.lv = el)}
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div
              style={{
                padding: 30,
                pAlign: "center",
                textAlign: "center"
              }}
            >
              {this.state.isLoading ? "加载中..." : "加载完成"}
            </div>
          )}
          renderRow={row}
          renderSeparator={separator}
          useBodyScroll={this.state.useBodyScroll}
          style={
            this.state.useBodyScroll
              ? {}
              : {
                  height: this.state.height,
                  border: "1px solid #ddd",
                  margin: "5px 0"
                }
          }
          pullToRefresh={
            <PullToRefresh
              ref={el => (this.ptr = el)}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              style={{
                overflow: "auto"
              }}
            />
          }
          onEndReachedThreshold={1000}
          onEndReached={this.onEndReached}
          pageSize={5}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  listState: state.orderReducer.listState
});

function mapDispatchToProps(dispatch) {
  return {
    setListState: bindActionCreators(setListState, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
