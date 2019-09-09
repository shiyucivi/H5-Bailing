import React from "react";
import "./index.scss";

export default class extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {}
  render() {
    const {
      placeholder,
      readOnly,
      name,
      hasRightButton,
      value,
      title
    } = this.props;
    return (
      <div
        className={`input_audio ${hasRightButton ? "hasRightButton" : ""}`}
        onClick={() => this.props.onClick && this.props.onClick()}
      >
        {title && title}
        <input
          type="text"
          name={name}
          readOnly={readOnly}
          onChange={event =>
            this.props.handleChange({ value: event.target.value, name })
          }
          placeholder={placeholder}
          value={value || ""}
        />
        {value && value.length > 0 && !hasRightButton && (
          <img
            src={require("../../assets/icon/audio/ic_carbook_search_delete.png")}
            alt="search_icon"
            onClick={() => {
              this.props.deleteAll({
                value: value,
                name
              });
            }}
          />
        )}
        {/* next button */}
        {hasRightButton && (
          <img
            src={require("../../assets/icon/audio/ic_hotel_order_next.png")}
            alt="search_icon"
            className="next_button"
          />
        )}
      </div>
    );
  }
}
