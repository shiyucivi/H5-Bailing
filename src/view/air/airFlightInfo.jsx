import React from "react";
import { WhiteSpace } from "antd-mobile";
import moment from "moment";
// 机票信息头部
export const renderAirInfo = order => (
  <div>
    <div className="flex">
      <div className="topAir">
        <span className="bgText">{order.flight_info.dpt_city}</span>
        <span className="midText">{order.flight_info.dpt_time}</span>
      </div>
      <div className="topAir smText">
        <div>{order.flight_info.flight_times}</div>
        <img
          style={{
            width: "90%",
            margin: "2px 0 5px",
            boxSizing: "border-box"
          }}
          src={require("../../assets/icon/ic_orders_airticket_arrow_right@2x.png")}
        />
        <div>{order.flight_info.carrier_name}</div>
      </div>
      <div className="topAir">
        <span className="bgText">{order.flight_info.arr_city}</span>
        <span className="midText">{order.flight_info.arr_time}</span>
      </div>
    </div>
    <WhiteSpace />
    <div className="flexR midText gray">
      <div className="topAir">
        <span>
          {order.flight_info.dpt_airport || order.flight_info.dpt_terminal}
        </span>
        <span>
          {order.flight_info.dpt_date.slice(5) +
            moment(order.flight_info.dpt_date).format("dddd")}
        </span>
      </div>

      <div className="topAir">
        <span>
          {order.flight_info.arr_airport || order.flight_info.arr_terminal}
        </span>
        <span>
          {moment(order.flight_info.arr_date)
            .format("L")
            .slice(5) + moment(order.flight_info.arr_date).format("dddd")}
        </span>
      </div>
    </div>
  </div>
);
