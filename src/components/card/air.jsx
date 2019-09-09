import { Card, WhiteSpace, WingBlank } from "antd-mobile";
import React from "react";
export default class CardAir extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {!this.props.noMargin && <WhiteSpace size="lg" />}
        <Card>
          <Card.Header
            title={this.props.title}
            extra={this.props.titleR && this.props.titleR}
          />
          <Card.Body>
            <WingBlank>{this.props.children}</WingBlank>
          </Card.Body>
        </Card>
        {!this.props.noMargin && <WhiteSpace size="lg" />}
      </div>
    );
  }
}
