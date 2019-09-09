import React from 'react'
import {HashRouter, Link, Route} from 'react-router-dom'

import Nav from "../../components/nav/audio_nav.js"

import './PayResult.css'

import successImage from '../../assets/icon/ic_movie_pay_success.png'
import failImage from '../../assets/icon/ic_movie_pay_falure.png'


export default class PayFulfill extends React.Component{
  constructor(props){
    super(props);
    this.state={
      payState:true,
    }
  }
  getPayState(){
    /*if(this.props.match.params.paycode){
      console.log('得到')
    }*/
    if(this.props.match.params.paycode=="102"){
      this.setState({
        payState:true
      })
    }
    else if(this.props.match.params.paycode=="103"){
      this.setState({
        payState:false
      })
    }else{
      this.setState({
        payState:false
      })
    }
  }
  componentWillMount(){
    this.getPayState();
  }

  render() {
    return (
      <div className="pay-state">
        <Nav
          title={'支付完成'}
          leftButton
          leftButtonClick={() => {
           if (this.state.isOrder) {
             console.log("exit");
           } else {
              return this.props.history.goBack();
           }
          }}
        />
        <div className="box">
          {this.state.payState?<img src={successImage} />:<img src={failImage} />}
          <h3 style={{fontWeight: 'normal',fontSize:'24px',color:'white'}}>{this.state.payState?'支付成功':'支付超时，订单已取消'}</h3>
          <Link to="./OrderDetail">
            <span>查看订单</span>
          </Link>
        </div>
      </div>
    )
  }
}