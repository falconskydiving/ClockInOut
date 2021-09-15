import { StyleSheet, Platform } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
    container: {
      flexDirection:'row', 
      justifyContent:'center', 
      backgroundColor:'#ffffff', 
      borderWidth:1, 
      borderColor:'#A5D6A7', 
      borderBottomWidth:3, 
      borderBottomColor:'#21ba45', 
      borderRadius: 5, 
      alignItems:'center',
    },
    inputwrapper: {
      flex:6,
      paddingTop:10,
      paddingLeft:10, 
      paddingBottom:10
    },
    inputlocation: {
      width: '100%',
      borderRadius: 5,
      borderColor: '#87c9ff',
      borderWidth: 1,
      // height: 40,
      height: Platform.OS == 'ios' ? hp('4%') : hp('5%'),
      fontSize: hp('2%'),
      backgroundColor: '#fff',

      paddingLeft:5,
      paddingTop:0,
      paddingBottom:0,
    },
    fullname: {
      // fontSize:15, 
      fontSize: hp('2%'),
      color:'black', 
      fontWeight:'bold'
    },
    btnregisterwrapper: {
      flex:4,padding:10
    },
    btnregisterapi: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: '#888',
      borderRadius: 5,
      height: Platform.OS == 'ios' ? hp('4%') : hp('5%'),
    },
    btnregisterapilabel: {
      padding: hp('0.8%'),
      color: 'white',
      fontSize: hp('2%'),
    }
})