import React from "react";
import { placeholder } from "@babel/types";

// 异步按需加载component
function asyncComponent(loadComponent, placeholder = "拼命加载中。。。") {
  return class AsyncComponent extends React.Component {
    constructor() {
      super();
      this.state = {
        Child: null
      };
      this.unmount = false;
    }
    componentWillUmmount() {
      this.unmount = true;
    }
    async componentDidMount() {
      const { default: Child } = await loadComponent();
      if (this.unmount) return;
      this.setState({
        Child
      });
    }
    render() {
      const { Child } = this.state;
      return Child ? <Child {...this.props} /> : placeholder;
    }
  };
}

export { asyncComponent };
