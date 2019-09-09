import React from "react";
import ReactDOM from "react-dom";
import "../../config/FindFocus.js";
export default class TvList extends React.Component {
  constructor() {
    super();
    this.state = {
      arr: [1, 2, 3, 4, 5]
    };
  }
  componentDidMount() {
    var dateObj = null;
    var dateTimer = null;

    window.addEventListener("load", function() {
      window.focus();
      if (!dateObj) {
        // dateObj = new Control();
      }

      // dateObj.updateTime();
      document.getElementById("nav_item1").focus();

      // FindFocus.FocusKeyEvent.focusBefore(leftFun,upFun,rightFun,downFun);
    });

    //需在该方法的执行完成后调用focus()获取焦点
    function leftFun(view) {
      console.log("left");
      view.focus();
    }
    function rightFun(view) {
      console.log("right");
      view.focus();
    }
    function upFun(view) {
      console.log("up");
      view.focus();
    }
    function downFun(view) {
      console.log("down");
      view.focus();
    }

    window.addEventListener("unload", function() {
      if (!dateTimer) {
        clearInterval(dateTimer);
      }
    });

    window.addEventListener("keydown", function(event) {
      switch (event.keyCode) {
        case 13: //确认
          alert("ok " + document.activeElement.id);
          break;
      }
    });
  }

  render() {
    return (
      <div>
        <ul>
          <div className="topBox">
            <div className="item" id="nav_item1" tabIndex="-1" />
            <div className="item" id="nav_item2" tabIndex="-1" />
            <div className="item" id="nav_item3" tabIndex="-1" />
          </div>
          {this.state.arr.map(item => (
            <li
              key={item}
              id={"nav_item" + 3 + item}
              className="item"
              tabIndex="-1"
              ref={this["ref" + item]}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
