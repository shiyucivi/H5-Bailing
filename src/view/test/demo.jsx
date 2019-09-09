import React from "react";
import { connect } from "react-redux";

@connect(({ orderReducer }) => ({
  orderReducer
}))
class Topic extends React.Component {
  constructor(props) {
    super(props);

    const { match } = props;
    this.state = {
      id: match.params.id
    };
  }

  componentDidMount() {
    console.log("====================================");
    console.log(this.props.orderReducer.topic);
    console.log("====================================");
    setTimeout(() => {
      this.props.dispatch({
        type: "fetchOrder",
        payload: {
          obj: "aaaaa"
        }
      });
    }, 1000);
  }

  render() {
    const topic = this.props.orderReducer.topic;

    return (
      <div className="container topic">
        <div>{topic}</div>
        {/* {author && (
          <div className="avatar">
            <img src={`${author.avatar_url}`} />
            <span>{author.loginname}</span>
          </div>
        )}

        <div className="topic-content">
          <div dangerouslySetInnerHTML={{ __html: topic.content }} />
        </div> */}
      </div>
    );
  }
}
export default Topic;
