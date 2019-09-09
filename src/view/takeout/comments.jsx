import React from "react";
import {TextareaItem} from "antd-mobile";
import ConfirmButton from "../../components/button/PayConfirmButton";
// import "./index.scss";
import Nav from "../../components/nav";
import {setTakeoutOrderInfo} from "../../reducer/action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

let comments = "";

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        const {comment} = this.props.orderInfo;
        const {setTakeoutOrderInfo, orderInfo} = this.props;
        return (
            <div className="comments_wrap zoom_audio">
                <Nav
                    mode={"audio"}
                    leftButtonClick={this.props.history.goBack}
                    title={"商家留言"}
                />
                <div className="page">
                    <div>
                        <TextareaItem
                            className="text_input"
                            placeholder="说出您的留言"
                            value={comment}
                            rows="5"
                            onChange={v => {
                                comments = v;
                                setTakeoutOrderInfo(
                                    Object.assign({}, orderInfo, {comment: v, isedited: true})
                                );
                            }}
                        />
                    </div>
                    <div
                        className="confirm-btn"
                        onClick={() => {
                            this.props.history.goBack();
                        }}>
                        <ConfirmButton content="确认" buttonType="confirm"/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    orderInfo: state.orderReducer.takeoutOrderInfo
});

function mapDispatchToProps(dispatch) {
    return {
        setTakeoutOrderInfo: bindActionCreators(setTakeoutOrderInfo, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Comments);
