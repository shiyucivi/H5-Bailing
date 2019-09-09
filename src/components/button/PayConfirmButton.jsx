import React from "react";

export default class ConfirmButton extends React.Component {
    constructor(props) {
        super(props);
        //这个组件有一个名为buttonType的props属性，当该属性的值为"confirm"时为确认按钮样式，否则为取消按钮样式
        //props属性content为按钮上的文字
    }

    render() {
        return (
            <div>
                {!this.props.config ? (
                    <input
                        className="pay-button"
                        style={
                            this.props.buttonType == "confirm"
                                ? styles.confirm
                                : styles.cancel
                        }
                        type="button"
                        value={this.props.content}
                        onClick={this.props.onClick}
                    />
                ) : (
                    <input
                        className="pay-button"
                        style={this.props.config && this.props.config}
                        type="button"
                        value={this.props.content}
                        onClick={this.props.onClick}
                    />
                )

                }
            </div>
        );
    }
}
var styles = {
    confirm: {
        width: "100%",
        color: "white",
        fontSize: "30px",
        height: "72px",
        lineHeight: "36px",
        backgroundColor: "rgba(43,84,142,1)",
        border: "none",
        borderRadius: "36px",
        padding: "10px 80px 10px 80px"
    },
    cancel: {
        width: "100%",
        color: "white",
        fontSize: "30px",
        height: "72px",
        lineHeight: "36px",
        backgroundColor: "rgba(225,38,38,0)",
        border: "none",
        borderRadius: "36px",
        padding: "10px 80px 10px 80px"
    }
};
