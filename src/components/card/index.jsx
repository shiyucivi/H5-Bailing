import React, { Component } from "react";
import "./index.css";
export default class Card extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="title">
          <span className="titleLeft">{this.props.title}</span>
          <span className="titleRight">{this.props.status}</span>
        </div>
        {this.props.children}
        <div className="bot">
          <span className="titleLeft">{this.props.date}</span>
          <span className="titleRight">
            {"实付：¥" + this.props.totalPrice}
          </span>
        </div>
      </div>
    );
  }
}
