import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default class TimeInOutBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {type: 'timein'}
    }
    _onPressBtnTimeIn() {
        this.setState({ type: 'timein' });
        this.props.setType('timein');
    }
    _onPressBtnTimeOut() {
        this.setState({ type: 'timeout' });
        this.props.setType('timeout');
    }
    render() {
		return (
			<View style={styles.container}>           
                <View style={styles.btnbundle}>
                    <TouchableWithoutFeedback onPress={this._onPressBtnTimeIn.bind(this)}>
                        <View style={this.state.type == 'timein'?styles.btnpanelactive:styles.btnpanel}>
                            <Text style={styles.btnlabel}>Hora de Entrada</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._onPressBtnTimeOut.bind(this)} >
                        <View style={this.state.type == 'timeout'?styles.btnpanelactive:styles.btnpanel}>
                            <Text style={styles.btnlabel}>Hora de Salida</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
		);
	}
}
const styles = StyleSheet.create(
{
    container: {
        padding: 5,
        flex:1,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 7,
        justifyContent: 'center',
        marginRight: 20,
        marginBottom: hp('3%'),//15
        marginLeft: 20,
        marginTop: Platform.OS === 'ios' ? 45 : 15
    },
    btnbundle: {
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'center',
        
    },
    btnpanelactive: {
        backgroundColor: '#03A9F4',
        borderRadius: 5,
        width:'50%',
        alignItems: 'center',
        padding: 5,
    },
    btnpanel: {
        backgroundColor: 'white',
        borderRadius: 5,
        width:'50%',
        alignItems: 'center',
        padding: 5,
    },
    btnlabel: {
        // fontSize: 16,
        fontSize: hp('2%')
    },
})

