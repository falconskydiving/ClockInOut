import { StyleSheet } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default StyleSheet.create({
    container: {
      backgroundColor:'#ffffff', 
      borderWidth:1, 
      borderColor:'#A5D6A7', 
      borderBottomWidth:3, 
      borderBottomColor:'#21ba45', 
      borderRadius: 5, 
      alignItems:'center',
    },
    contentwrapper: {
      paddingTop:20,
      paddingBottom:20,
    },
    messagewrapper: {
      paddingBottom:20,
    },
    content: {
      // fontSize:15, 
      fontSize: hp('2%'),
      color:'black'
    },
    fullname: {
      // fontSize:15, 
      fontSize: hp('2%'),
      color:'black', 
      fontWeight:'bold'
    }
})