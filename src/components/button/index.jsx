import React, { Component } from "react";
import "./index.css";

export default class Button extends React.Component {
    render() {
        return (
                <div className='textCenter'>
                    <div className='pButton'>
                        {this.props.text}
                    </div>
            </div>
        );
    }
}
