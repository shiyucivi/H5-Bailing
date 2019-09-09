import React, { Component } from "react";
import "./index.css";

export default class StatusImage extends React.Component {
  render() {
    return (
      <div className="containerBox">
        <div>{this.props.image}</div>
        <div className="text">{this.props.text}</div>
      </div>
    );
  }
}
