import {NativeModules, Platform} from 'react-native';
//module.exports = NativeModules.GoHomeAndroid;

if(Platform.OS === 'ios'){
	module.exports = NativeModules.GoHome;
}else{
	module.exports = NativeModules.GoHomeAndroid;
}
