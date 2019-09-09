import React from "react";
import "./index.scss";

export default class extends React.Component {
    render() {
        return (
            <div className="nav_audio">
                <div
                    onClick={() => this.props.leftButtonClick()}
                    // style={{ width: "80%" }}
                >
                    <img
                        className="navIcon"
                        src={require("../../assets/img/ic_back@2x.png")}
                    />
                    {this.props.title}
                </div>
                {this.props.rightButton && this.props.rightButton}
                {
                    this.props.showRightButton &&
                    <input className="cookbook_btn" type="button" value={this.props.rightButtonValue}/>
                }
            </div>
        );
    }
}
