import React from "react";
import { NavBar, Icon } from "antd-mobile";
import NavAudio from "./audio_nav";

export default class extends React.Component {
  render() {
    return (
      <div>
        {this.props.mode == "audio" ? (
          <NavAudio
            leftButtonClick={this.props.leftButtonClick}
            rightButton={this.props.rightButton}
            title={this.props.title}
            showRightButton = {this.props.showRightButton}
            rightButtonValue = {this.props.rightButtonValue}
          />
        ) : (
          <NavBar
            style={{
              position: "fixed",
              width: "100%",
              top: 0,
              left: 0,
              zIndex: 12
            }}
            mode="light"
            leftContent={
              this.props.leftButton && (
                <img
                  style={{ height: "48px", width: "48px" }}
                  src={require("../../assets/icon/ic_orders_back.png")}
                />
              )
            }
            rightContent={
              this.props.rightButton && (
                <img
                  onClick={() => this.props.rightButtonClick()}
                  style={{ height: "48px", width: "48px" }}
                  src={require("../../assets/icon/ic_add@2x.png")}
                />
              )
            }
            onLeftClick={() => this.props.leftButtonClick()}
          >
            {this.props.title}
          </NavBar>
        )}
      </div>
    );
  }
}
