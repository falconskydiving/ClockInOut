import React, { Component } from "react";
import { View, Text, StyleSheet, Platform, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Clock extends Component {
	constructor() {
		super();
		this.state = { screenWidth:"", screenHeight:"", currentTime: null, currentDay: null, currentDate: null, currentDateMinus: null, 
			clockHightWidth:"", clockRadius:"", fontDay: "", fontTime:"", fontDate: "" }
        this.daysArray = ['Domingo,', 'Lunes,', 'Martes,', 'Miercoles,', 'Jueves,', 'Viernes,', 'Sábado,'];
        
        this.monthsArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

		// this.otherPanelHeight = Platform.OS === 'ios' ? 360 : 380;
		this.otherPanelHeight = Platform.OS === 'ios' ? 80 + hp('37.5%') : 80 + hp('40.5%');

	}

	componentWillMount() {
		this.getCurrentTime();
		this._getScreenSize();
	}
	
	_getScreenSize = () => {
		// const screenWidth = Math.round(Dimensions.get('window').width);
		// const screenHeight = Math.round(Dimensions.get('window').height);
		const screenWidth = wp('100%');
		const screenHeight = hp('100%');
		// let clockHightWidth = Math.round(screenHeight-this.otherPanelHeight);
		
		let clockHightWidth = Math.round(screenHeight-this.otherPanelHeight);
		if(clockHightWidth > (screenWidth-50)){
			clockHightWidth = screenWidth-50;
		}
		const fontDay = Math.round(clockHightWidth/8)-1;
		this.setState({ screenWidth: screenWidth, screenHeight: screenHeight, clockHightWidth: clockHightWidth, clockRadius: Math.round(clockHightWidth/2),
			fontDay:fontDay, fontTime:fontDay-2, fontDate:fontDay-8})
	}
	timeclockStyle = function(realHeight, realRadius) {
		return {
			width: realHeight,
            height: realHeight,
            borderRadius: realRadius,
            justifyContent: 'center',
            backgroundColor: '#2196F3',
            borderWidth: hp('1%'),
            borderColor: '#B2EBF2',
            marginBottom: 0,
            alignItems: 'center',
		}
	}
	daysTextStyle = function(realFontSize) {
		return {
			color: '#ffffff',
			fontSize: realFontSize,
			paddingBottom: 8,
		}
	}
	timeTextStyle = function(realFontSize) {
		return {
			fontSize: realFontSize,
            color: '#000000',
            paddingBottom: 8,
		}
	}
	dateTextStyle = function(realFontSize) {
		return {
			color: '#ffffff',
			fontSize: realFontSize,
		}
	}
	getCurrentTime = () => {
		let hour = new Date().getHours();
		let minutes = new Date().getMinutes();
		let seconds = new Date().getSeconds();
		let am_pm = 'PM';

		if(minutes < 10) {  minutes = '0' + minutes;    }

		if(seconds < 10) {  seconds = '0' + seconds;    }
		if(hour > 12) { hour = hour - 12;   }
		if(hour == 0) { hour = 12;  }
        if(hour < 10) { hour = '0' + hour;  }

		if(new Date().getHours() < 12) {    am_pm = 'AM';   }

		this.setState({currentTime: hour + ':' + minutes + ':' + seconds + ' '+ am_pm});

		this.daysArray.map((item, key) => {
			if(key == new Date().getDay()) {
				this.setState({ currentDay: item.toUpperCase() });
			}
        })

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let d = date.getDate();

        this.monthsArray.map((item, key) => {
			if(key == month) {
				this.setState({ currentDate: item +' '+d+', '+year });
			}
		})
		
		if(month < 10){
			if(d<10){
				this.setState({currentDateMinus: year+'-'+'0'+(month+1)+'-'+'0'+d});
			}else{
				this.setState({currentDateMinus: year+'-'+'0'+(month+1)+'-'+d});
			}
		}
		else{
			if(d<10){
				this.setState({currentDateMinus: year+'-'+(month+1)+'-'+'0'+d});
			}else{
				this.setState({currentDateMinus: year+'-'+(month+1)+'-'+d});
			}
		}
    }
    
	componentWillUnmount() {
		clearInterval(this.timer);
    }
    
	componentDidMount() {
		this.timer = setInterval(() => {
			this.getCurrentTime();
		}, 1000);
	}
	
    getDateTime(panel){
		this.props.pickDateTime(panel, this.state.currentTime, this.state.currentDateMinus);
	}
	
	render() {
		return (
			<View style={styles.container}>
                <View style={styles.clockwrapper}>
                    <View style={this.timeclockStyle(this.state.clockHightWidth, (this.state.clockHightWidth)/2)} >
					    <Text style={this.daysTextStyle(this.state.fontDay)}>{this.state.currentDay}</Text>
					    <Text style={this.timeTextStyle(this.state.fontTime)}>{this.state.currentTime}</Text>
                        <Text style={this.dateTextStyle(this.state.fontDate)}>{this.state.currentDate}</Text>
				    </View>
                </View>				
			</View>
		);
	}
}

const styles = StyleSheet.create(
	{
        container: {
			flex: 1,
			//paddingTop: (Platform.os === 'ios') ? 0 : 0,
			justifyContent: 'center',
			alignItems: 'center',
        },
        clockwrapper: {
            width:'100%', 
            alignItems: 'center',
        },
	}
)