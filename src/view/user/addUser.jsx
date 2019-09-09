import React, { Component } from "react";
import Nav from "../../components/nav";
import { WhiteSpace } from "antd-mobile";
import { Button } from "antd-mobile";

const PlaceHolder = ({ className = '', ...restProps}) => (
		<div className={`${className} placeHolder`} {...restProps}>Block</div>
	);

class AddUser extends Component {
	state={}
  constructor(props) {
    super(props);
    // this.state={

    // }
  }

  render() {
    return (
    	<div>
            <Nav
                title="添加新用户"
                leftButton={1}
                leftButtonClick={this.props.history.goBack}
            />
            <WhiteSpace size="lg"/>
            <div id="content" style={styles.container}>
            	<div style={styles.textStyle}>
            		证件类型
            		<div id="select" style={styles.select}>
	            		<div style={styles.selectTag}>
	            			身份证
	            		</div>
	            		<div style={styles.selectTag}>
	            			护照
	            		</div>
            		</div>
            	</div>
            	<div style={styles.textStyle}>
            		证件号码
            		<input type="text" id="idnumber" name="idnumber" class="text" placeholder="证件号码" style={styles.inputStyle}/>
            	</div>
            	<div style={styles.textStyle}>
            		姓名&#12288;&#12288;
            		<input type="text" id="name" name="name" class="text" placeholder="姓名" style={styles.inputStyle}/>
            	</div>
            	<div style={styles.textStyle}>
            		联系方式
            		<input type="text" id="contact" name="contact" class="text" placeholder="联系方式" style={styles.inputStyle}/>
            	</div>
            	<div style={styles.textStyleNoline}>
            		性别&#12288;&#12288;
            		<div id="select" style={styles.select}>
	            		<div style={styles.selectTag}>
	            			男
	            		</div>
	            		<div style={styles.selectTag}>
	            			女
	            		</div>
            		</div>
            	</div>
            </div>
            <Button style={styles.buttonStyle}>保存</Button>
        </div>
    );
  }
}
export default AddUser;
//位置的调整。内外边距  padding。margin
var styles = {
	container : {
		backgroundColor:"#FFFFFF",
	},
	textStyle : {
		fontSize:"14px",
		backgroundColor:"#FFFFFF",
		width:"92%",
		height:"50px",
		lineHeight:'50px',
		borderBottom:"1px double #DADCDF",
		margin:"0 4%"
		// textAlign:'center'
	},
	textStyleNoline : {
		fontSize:"14px",
		backgroundColor:"#FFFFFF",
		width:"92%",
		height:"50px",
		lineHeight:'50px',
		margin:"0 4%"
		// textAlign:'center'
	},
	select : {
		display:"inline",
		margin:"0 50px"
	},
	selectTag : {
		display:"inline-block",
		fontSize:"12px",
		border:"1px solid #8B8B96",
		color:"#8B8B96",
		borderRadius:"7px",
		textAlign:"center",
		lineHeight:"25px",
		width:"70px",
		margin:"0 0 0 10px"
	},
	inputStyle : {
		marginLeft:"60px"
	},
	buttonStyle : {
		width:"92%",
		margin:"450px 4% 10px",
		backgroundColor:"#1687FF",
		color:"#FFFFFF",
		fontSize:"18px"
	}
};