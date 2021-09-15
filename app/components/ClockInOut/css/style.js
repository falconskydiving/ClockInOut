import { StyleSheet, Platform } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default StyleSheet.create({
    container: {
        backgroundColor: '#f1f1f1',
    },

    spinnerTextStyle: {
        color: '#FFF', 
        fontSize: hp('3%')
    },

    clockwrapper: {
        width:'100%', 
        alignItems: 'center',
        paddingTop: hp('3%'),
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },
    enterInput: {
        // margin: 5,
        width : '100%',
        borderColor: '#87c9ff',
        borderWidth: 1,
        borderRadius: 5,
        // fontSize: 16,
        fontSize: hp('2%'),
        height: Platform.OS == 'ios' ? hp('4%') : hp('5%'),
        backgroundColor: '#fff',
        // marginBottom: 5,
        marginBottom: hp('0.7%'),

        paddingLeft:5,
        paddingTop:0,
        paddingBottom:0,
    },
    enterIDInputwrapper:{
        flex:6,
        paddingRight: 5,
    },
    enterIDInput:{
        width: '100%',
        borderRadius: 5,
        borderColor: '#87c9ff',
        borderWidth: 1,
        // height: 40,
        fontSize: hp('2%'),
        height: Platform.OS == 'ios' ? hp('4%') : hp('5%'),
        backgroundColor: '#fff',

        paddingLeft:5,
        paddingTop:0,
        paddingBottom:0,
    },
    confirmidwrapper: {
        flex: 1, 
        flexDirection: 'row',
        marginBottom: hp('0.7%')//5,
    },
    confirmbtnwrapper:{
        flex:4
    },
    btnconfirm: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#21ba45',
        borderRadius: 5,
        // height: 40,
        height: Platform.OS == 'ios' ? hp('4%') : hp('5%'),
    },
    btnconfirmlabel:{
        padding: hp('0.8%'),
        color: 'white',
        // fontSize: 17,
        fontSize: hp('2%'),
    },
    locationpanel: {
        width: '100%', 
        backgroundColor: '#2196f3',
        paddingTop:10,
        paddingRight: 15,
        paddingBottom: 10,
        paddingLeft: 15, 
    },
    ipwrapper: {
        flex:1, 
        flexDirection:'row', 
        // marginBottom: 3,
        marginBottom: hp('0.5%'),
    },
    iplabel: {
        color:'white', 
        // fontSize:15,
        fontSize: hp('2%'),
        flex:3
    },
    ipcontent: {
        color:'white', 
        // fontSize:15,
        fontSize: hp('2%'),
        flex:7
    },
    citywrapper:{
        flexDirection:'row', 
        // marginBottom: 3,
        marginBottom: hp('0.5%'),
    },
    latlngeditapiwrapper:{
        flexDirection:'row',
    },
    latlngwrapper: {
        width:'100%', 
        flexDirection:'row'
    },
    locationinfo:{
        color:'white', 
        // fontSize:15,
        fontSize: hp('2%'),
    },
    editapiwrapper: {
        marginLeft: -hp('2.5%'),
        marginTop:-hp('0.6%'),
    },
    editapibtn: {
        width: hp('3%'), 
        height: hp('3%'),
    }
})