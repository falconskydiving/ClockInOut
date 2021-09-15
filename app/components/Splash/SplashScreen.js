import React from 'react';
import { Platform, ImageBackground, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class SplashScreen extends React.Component {
  performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2000
      )
    )
  }

  async componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate('App');
    }
  }

  render() {
    if (Platform.OS === "ios") {
      if (Platform.isPad) {
        return (
          <Image source={require('../ClockInOut/img/splash_wide.png')} style={{flex:1, resizeMode:'stretch'}}>
          </Image>
        );
      } else {
        return (
          <ImageBackground source={require('../ClockInOut/img/splash.png')} style={{ width: wp('100%'), height: hp('100%') }}>
          </ImageBackground>
        );
      }
    } else if (Platform.OS === "android") {
      return (
        <Image source={require('../ClockInOut/img/splash_android.png')} style={{flex:1, resizeMode:'stretch', width:null, height:null,}}>
          </Image>
      );
    } else {
      return (
        <Image source={require('../ClockInOut/img/splash_android.png')} style={{flex:1, resizeMode:'stretch', width:null, height:null,}}>
        </Image>
      );
    }
  }
}
export default SplashScreen;