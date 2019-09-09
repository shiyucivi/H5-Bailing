import React from "react";

import Nav from "../../components/nav/audio_nav.js";
import "./PayConfirm.css";

import OrderDetailList from "../../components/orderdetail/OrderDetailList.jsx"
import PayConfirmButton from "../../components/button/PayConfirmButton.jsx"


export default class OrderDetail extends React.Component {
  constructor(props){
    super(props);
    this.state={
      orderCode:this.props.match.params.id,
      paySuccess:false
    }
  }
  render() {
    return (
      <div className="pay-confirm">
        <Nav
          title={"订单详情"}
          leftButton
          leftButtonClick={() => {
            if (this.state.isOrder) {
              console.log("exit");
            } else {
              return this.props.history.goBack();
            }
          }}
        />
        <div className="box">
          <div className="main">
            <OrderDetailList {...this.props} orderType="movie"  orderCode={this.state.orderCode}/>
          </div>
        </div>
      </div>
    );
  }
}
